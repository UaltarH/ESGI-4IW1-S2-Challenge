const User = require('../sequelize/models/User.js');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

class authController {

  static async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.create({ email, password });
      // sendConfirmationEmail(user.email, user.confirmationToken);
      res.status(201).send({ user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

module.exports = authController;