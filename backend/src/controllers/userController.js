const { User } = require('../sequelize/models/');
const crudService = require('../services/crudGeneric');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class userController {
  static async getUsers(req, res) {
    const { data, error } = await crudService.findAll(User, req.query);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ users: data });
  }

  static async register(req, res, next) {
    const { data, error } = await crudService.create(User, req.body);
    if (error) {
      return next(error);
    }
    res.status(201).json({ success: true, user: data });
  }

  static async getUser(req, res) {
    const { data, error } = await crudService.findByPk(User, req.params.id);
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(200).json({ user: data });
  }

  static async deleteUser(req, res) {
    const { data, error } = await crudService.destroy(User, req.params.id);
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    res.sendStatus(204);
  }

  static async replaceUser(req, res) {
    const { data: deletedData, error: deleteError } = await crudService.destroy(User, req.params.id);
    if (deleteError) {
      return res.status(404).json({ error: deleteError.message });
    }
    const { data, error } = await crudService.create(User, req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(deletedData ? 200 : 201).json({ user: data });
  }

  static async modifyUsers(req, res) {
    const { data, error } = await crudService.update(User, req.params.id, req.body);
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    res.json({ user: data });
  }
  
  static async login(req, res) {
    if (Object.keys(req.body).length > 2) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('auth_token', token, {
            httpOnly: true, // Le cookie n'est pas accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Utiliser uniquement HTTPS en production
            maxAge: 3600000 // 1 heure
        });

        return res.status(200).json({ 
            message: 'Authentication successful', 
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            } 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

}

module.exports = userController;
