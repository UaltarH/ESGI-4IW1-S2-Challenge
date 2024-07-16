const jwt = require('jsonwebtoken');
const { findByPk } = require("../services/crudGeneric");
const { User } = require('../sequelize/models/');
const bcrypt = require("bcryptjs");
const crudService = require("../services/crudGeneric");
const validate = require("./validate");
const role = require("../dto/role.dto");
const {
    userRegisterAdminSchema,
    userRegisterUserSchema,
    userModifyAdminSchema,
    userModifyUserSchema
} = require("../schema/");

const checkRole = () => async (req, res, next) => {
    const token = req.cookies['auth_token'];
    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            if (payload.role === role.ADMIN) {
                const user = await findByPk(User, payload.id);
                if(user)
                    if(user.role ===  role.ADMIN) {
                        if(req.method === 'POST')
                            validate(userRegisterAdminSchema);
                        if(req.method === 'PATCH')
                            validate(userModifyAdminSchema);
                        next();
                    }
            }
            if(req.method === 'PATCH') {
                const {data, error} = await crudService.findByPk(User, req.params.id);
                const isPasswordValid = await bcrypt.compare(req.body.password, data.password);
                if (!isPasswordValid) {
                    return res.sendStatus(401);
                }
                // un utilisateur non-admin ne peut modifier que ces infos, même de son compte
                validate(userModifyUserSchema);
                next();
            } else {
                // un utilisateur non-admin ne peut créer d'utilisateur
                return res.sendStatus(403);
            }
        } catch (e) {
            return res.sendStatus(500);
        }
    }
    // création d'un utilisateur par une personne non identifiée
    validate(userRegisterUserSchema);
    req.body.role =  role.USER;
    next();
}
module.exports = checkRole;