const { User, User_pref } = require("../sequelize/models/");
const crudService = require("../services/crudGeneric");
const { sendEmailWithTemplate } = require("../services/sendMail");
const { sendMail } = require("../services/sendMail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userQueue } = require('../config/queueBullConfig');

class userController {
  static async getUsers(req, res) {
    const { data, error } = await crudService.findAll(User, req.query);
    if (error) {
      return res.status(400);
    }
    res.json({ users: data });
  }

  static async register(req, res, next) {
    try {
      const existingUser = await crudService.findOne(User, { email: req.body.email });
      if (existingUser.data) {
        return res.status(409).json(); 
      }

      const { newProduct, restockProduct, priceChange, ...fieldsForCreateUser } = req.body;

      const { data, error } = await crudService.create(User, fieldsForCreateUser);
        if (error) {
          return res.status(500).json();
        }
    
      const User_prefData = {
        UserId: data.id,
        newProduct,
        restockProduct,
        priceChange,
      };
      await crudService.create(User_pref, User_prefData);

      await userQueue.add(
        { userId: data.id },
        { delay: 2 * 60 * 1000 }
      );

      try {
        await sendEmailWithTemplate(
            req.body.email,
            "Veuillez vérifier votre compte",
            {
              fullname: req.body.firstname + " " + req.body.lastname ,
              link: (process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://boxtobe.mapa-server.org") + "/verify/" + data.verification_token
          },
            "/../template/accountConfirmation.ejs");
      } catch (error) {
        console.error("Failed to send email controller", error);
      }

      res.sendStatus(201);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur", error);
      res.status(500).json({ error: "Une erreur interne s'est produite." });
    }
  }


  static async getUser(req, res) {
    const attributes = req.query.fields ? req.query.fields.split(",") : [];
    if (attributes.length === 0) {
      const { data, error } = await crudService.findByPk(User, req.params.id);
      if (error) {
        return res.status(404);
      }
      res.status(200).json({ user: data });
    } else {
      const user = await User.findOne({ where: { id: req.params.id }, attributes });
      if (!user) {
        return res.status(404);
      }
      res.status(200).json({ user });
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

          if (!user) {
              return res.status(404).json();
          }

          if (user.role === 'admin') {
              return res.status(403).json();
          }

          const { data, error } = await crudService.destroy(User, req.params.id);
          if (error) {
              return res.status(500).json();
          }

          res.status(204).json()
      } catch (error) {
          res.status(500).json();
      }
  }

  static async deleteMultiplesUsers(req, res) {
    const { usersId } = req.body;
    const ids = usersId.split(",");

    try {
      const users = await User.findAll({
        where: {
          id: ids
        }
      });

      const nonAdminUsers = users.filter(user => user.role !== 'admin');
      const nonAdminIds = nonAdminUsers.map(user => user.id);

      const deletionPromises = nonAdminIds.map(async (id) => {
        const { data, error } = await crudService.destroy(User, id);
        if (error) {
          throw new Error(`User with ID ${id} not found: ${error.message}`);
        }
      });

      await Promise.all(deletionPromises);

      res.sendStatus(204);
    } catch (error) {
      console.error("Deletion error:", error);
      res.status(500).json({ error: "An error occurred while deleting the users" });
    }
  }


  static async replaceUser(req, res) {
    const { data: deletedData, error: deleteError } = await crudService.destroy(User, req.params.id);
    if (deleteError) {
      return res.status(404);
    }
    const { data, error } = await crudService.create(User, req.body);
    if (error) {
      return res.status(400);
    }
    res.sendStatus(deletedData ? 200 : 201);
  }

  static async modifyUsers(req, res) {
    if(req.body.newPassword) {
      req.body.password = req.body.newPassword;
      delete req.body.newPassword
    }
    const { data, error } = await crudService.update(User, req.params.id, req.body);
    if (error) {
      return res.status(404);
    }
    res.sendStatus(204);
  }

  static async login(req, res) {
    let { email, password } =  req.body;
    email = email.toLowerCase();
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.sendStatus(401);
      }

      if (!user.is_verified) {
        return res.sendStatus(403);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.sendStatus(401);
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.status(200).json({ token });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  static async verify(req, res) {
    const { token } = req.params;

    if (!token) {
      return res.sendStatus(400);
    }

    try {
      const user = await User.findOne({ where: { verification_token: token } });

      if (!user) {
        return res.sendStatus(404);
      }

      if (user.is_verified) {
        return res.sendStatus(400);
      }

      user.is_verified = true;
      user.verification_token = null;
      await user.save();

      // remove job
      const jobs = await userQueue.getJobs(['delayed']);
      const userJob = jobs.find(job => job.data.userId === user.id);
      if (userJob) {
        await userJob.remove();
      }

      return res.sendStatus(200);

    } catch (error) {
      return res.sendStatus(500);
    }
  }
  static async checkUser(req, res, next) {
    const { UserId, password } = req.body;
    const { data: user, error } = await crudService.findByPk(User, UserId);
    if(UserId !== user.id)
      return res.sendStatus(403);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.sendStatus(401);
    }
    else {
      return res.sendStatus(200);
    }
  }
}

module.exports = userController;
