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
    res.status(400);
    console.log(err);
  }
};
module.exports = validate;
