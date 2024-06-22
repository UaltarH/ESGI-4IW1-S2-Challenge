const { User } = require('../sequelize/models');


class userController {

  static async getUsers(req, res) {
    try {
      const users = await User.findAll({
        where: req.query,
      });
      res.json({ users });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async register(req, res, next) {
    try {
      console.log(req.body, 'register')
      const user = await User.create(req.body);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }
  static async getUser(req, res) {
    const user = await User.findByPk(parseInt(req.params.id, 10));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  }

  static async deleteUser(req, res) {
    const nbDeleted = await User.destroy({
      where: {
        id: parseInt(req.params.id, 10),
      },
    });
    if (nbDeleted === 1) res.sendStatus(204);
    else {
      res.status(404).json({ error: 'User not found' });
    }
  }
  static async put(req, res) {
    try {
      const nbDeleted = await User.destroy({
        where: {
          id: parseInt(req.params.id, 10),
        },
      });
      const user = await User.create(req.body);
      res.status(nbDeleted === 1 ? 200 : 201).json({ user });
    } catch (error) {
      next(e)
    }
  }

  static async patch (req, res) {
    try {
      const [nbUpdated, users] = await User.update(req.body, {
        where: {
          id: parseInt(req.params.id, 10),
        },
        returning: true,
      });
      if (nbUpdated === 1) {
        const user = await User.findByPk(parseInt(req.params.id, 10));
        res.json({ user });
      } else {
        res.status(404);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;