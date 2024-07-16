const { User } = require('../sequelize/models/');
const crudService = require('../services/crudGeneric');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class userController {
  static async getUsers(req, res) {
    const { data, error } = await crudService.findAll(User, req.query);
    if (error) {
      return res.status(400);
    }
    res.json({ users: data });
  }

  static async register(req, res, next) {
    const { data, error } = await crudService.create(User, req.body);
    if (error) {
      return next(error);
    }
    res.sendStatus(201);
  }

  static async getUser(req, res) {
    const { data, error } = await crudService.findByPk(User, req.params.id);
    if (error) {
      return res.status(404);
    }
    res.status(200).json({ user: data });
  }

  static async deleteUser(req, res) {
    const { data, error } = await crudService.destroy(User, req.params.id);
    if (error) {
      return res.status(404);
    }
    res.status(204).json({ user: data });
  }

  static async deleteMultiplesUsers(req, res) {
    const { usersId } = req.body; 
    const ids = usersId.split(',');

    try {
        const deletionPromises = ids.map(async (id) => {
            const { data, error } = await crudService.destroy(User, id);
            if (error) {
                throw new Error(`User with ID ${id} not found: ${error.message}`);
            }
        });

        await Promise.all(deletionPromises);

        res.sendStatus(204);
    } catch (error) {
        console.error('Deletion error:', error);
        res.status(500).json({ error: 'An error occurred while deleting the users' });
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
    res.status(deletedData ? 200 : 201);
  }

  static async modifyUsers(req, res) {
    const { data, error } = await crudService.update(User, req.params.id, req.body);
    if (error) {
      return res.status(404);
    }
    res.json({ user: data });
  }
  
  static async login(req, res) {
    if (Object.keys(req.body).length > 2) {
        return res.status(400);
    }

    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(401);
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401);
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('auth_token', token, {
            httpOnly: true, // Le cookie n'est pas accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Utiliser uniquement HTTPS en production
            maxAge: 3600000 // 1 heure
        });

        return res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
}

}

module.exports = userController;
