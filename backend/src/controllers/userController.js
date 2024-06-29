const { User } = require('../sequelize/models/');
const crudService = require('../services/crudGeneric');

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

  static async put(req, res) {
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

  static async patch(req, res) {
    const { data, error } = await crudService.update(User, req.params.id, req.body);
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    res.json({ user: data });
  }
}

module.exports = userController;
