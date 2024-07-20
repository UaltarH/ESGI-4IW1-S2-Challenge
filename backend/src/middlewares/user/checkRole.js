const jwt = require('jsonwebtoken');
const { findByPk } = require("../../services/crudGeneric");
const { User } = require('../../sequelize/models/');
const bcrypt = require("bcryptjs");
const crudService = require("../../services/crudGeneric");
const validate = require("./../validate");
const role = require("../../dto/role.dto");
const {
    userRegisterAdminSchema,
    userRegisterUserSchema,
    userModifyAdminSchema,
    userModifyUserSchema
} = require("../../schema/");

const checkRole = () => async (req, res, next) => {
    const header = req.headers.Authorization ?? req.headers.authorization;
    if (!header) {
        if(req.method !== 'POST')
            return res.sendStatus(401);
        else {
            // création d'un utilisateur par une personne non identifiée
            validate(userRegisterUserSchema);
            req.body.role = role.USER;
            next();
        }
    } else {
        const [type, token] = header.split(/\s+/);
        if (type !== "Bearer") return res.sendStatus(401);

        if (token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                const {data, error} = await findByPk(User, payload.id);
                if (!data) return res.sendStatus(401);

                // admin
                if (payload.role === role.ADMIN) {
                    if (data.role === role.ADMIN) {
                        if (req.method === 'POST')
                            validate(userRegisterAdminSchema);
                        if (req.method === 'PATCH')
                            return validate(userModifyAdminSchema)(req, res, (err) => {
                                if (err) return; // `validate` a déjà envoyé une réponse en cas d'erreur
                                next();
                            });
                        return next();
                    } else {
                        return res.sendStatus(403);
                    }
                }
                // non admin
                if (req.method === 'PATCH') {
                    const isPasswordValid = await bcrypt.compare(req.body.password, data.password);
                    if (!isPasswordValid) {
                        return res.sendStatus(401);
                    }
                    // un utilisateur non-admin ne peut modifier que certaines infos, même de son compte
                    validate(userModifyUserSchema);
                    return next();
                } else if (req.method === 'POST') {
                    // un utilisateur non-admin ne peut créer d'utilisateur
                    return res.sendStatus(403);
                } else if (req.method === 'GET') {
                    // un utilisateur non-admin ne peut voir que ses infos
                    const id = req.params.id;
                    // pas d'id → il essaie de voir tous les utilisateurs
                    if (!id) return res.sendStatus(403);
                    if (data.id !== id) return res.sendStatus(403);
                    return next();
                }
            } catch (e) {
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(401);
        }
    }
}
module.exports = checkRole;