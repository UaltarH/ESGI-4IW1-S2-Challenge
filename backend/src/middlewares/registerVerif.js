const registerVerif = () => (req, res, next) => {
    try {
      if (req.body.password === req.body.passwordConfirmation) {
        delete req.body.passwordConfirmation;
        req.body.role = "user";
      }
      else{
        throw new Error("Password and password confirmation must be the same");
      }
      next();
    } catch (err) {
      res.status(400).json({
        errors: [
          {
            message: err.message,
          },
        ],
      });
    };
  }
  module.exports = registerVerif;
  