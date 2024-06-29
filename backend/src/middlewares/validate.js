const validate = (schema) => (req, res, next) => {
  try {
    let validatedeData = schema.parse(req.body);

    if (validatedeData.password === validatedeData.passwordConfirmation) {
      delete validatedeData.passwordConfirmation;
      validatedeData.role = "user";
    }
    req.body = validatedeData;
    next();
  } catch (err) {
    if (err) {
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
            message: err.message,
          },
        ],
      });
    }
  };
}
module.exports = validate;
