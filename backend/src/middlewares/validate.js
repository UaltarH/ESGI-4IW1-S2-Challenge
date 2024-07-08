const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      res.status(400).json({
        errors: err.errors.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    } else {
      res.status(400).json({
        errors: [
          {
            message: err.message || 'Validation error',
          },
        ],
      });
    }
  }
};

module.exports = validate;
