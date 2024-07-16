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
    const attributes = req.query.fields ? req.query.fields.split(',') : [];
    if(attributes.length === 0) {
        const {data, error} = await crudService.findByPk(User, req.params.id);
        if (error) {
            return res.status(404);
        }
        res.status(200).json({user: data});
    }
    else {
        const user = await User.findOne({where: {id: req.params.id}, attributes});
        if (!user) {
            return res.status(404);
        }
        res.status(200).json({user});
    }
  }

  static async deleteUser(req, res) {
    const { data, error } = await crudService.destroy(User, req.params.id);
    if (error) {
      return res.status(404);
    }
    res.sendStatus(204);
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
    const { data, error } = await crudService.update(User, req.params.id, req.body);
    if (error) {
      return res.status(404);
    }
    res.sendStatus(204);
  }
  
  static async login(req, res) {
    if (Object.keys(req.body).length > 2) {
        return res.sendStatus(400);
    }

    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.sendStatus(401);
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.sendStatus(401);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('auth_token', token, {
            httpOnly: process.env.NODE_ENV === 'production', // Le cookie n'est pas accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Utiliser uniquement HTTPS en production
            maxAge: 3600000, // 1 heure
            domain: 'localhost',
        });

        return res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }
  }

}

module.exports = userController;
