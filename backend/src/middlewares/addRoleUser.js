const addRoleUser = () => (req, res, next) => {
    try {
      req.body.role = "user";
      next();
      }
    catch (err) {
      res.status(400)
    };
  }
  module.exports = addRoleUser;
  