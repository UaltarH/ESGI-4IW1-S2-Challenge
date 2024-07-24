const validate = require("./../validate");
const { passwordResetRequest,userUpdateByUserSchema } = require("../../schema/");

const checkRole = () => async (req, res, next) => {
    const header = req.headers.Authorization ?? req.headers.authorization;
    if (!header) {
        if(req.method === 'GET') {
            return next();
        } else if(req.method === 'POST') {
            return validate(passwordResetRequest)(req, res, next);
        } else if(req.method === 'PATCH') {
            return validate(userUpdateByUserSchema)(req, res, next)
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.status(403);
    }
}
module.exports = checkRole;