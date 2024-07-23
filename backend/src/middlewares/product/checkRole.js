const jwt = require('jsonwebtoken');
const { findByPk } = require("../../services/crudGeneric");
const { User } = require('../../sequelize/models/');
const bcrypt = require("bcryptjs");
const validate = require("./../validate");
const role = require("../../dto/role.dto");
const { createProductSchema } = require("../../schema/");
const { updateProductSchema } = require("../../schema/");

const checkRole = () => async (req, res, next) => {
    const header = req.headers.Authorization ?? req.headers.authorization;
    if (!header) {
        if (req.method !== 'POST')
            return res.sendStatus(401);
        // else {
        //     // création d'une commande par une personne non identifiée
        //     validate(userRegisterUserSchema);
        //     req.body.role = role.USER;
        //     next();
        // }
    } else {
        const [type, token] = header.split(/\s+/);
        if (type !== "Bearer") return res.sendStatus(401);

        if (token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                const { data, error } = await findByPk(User, payload.id);
                if (!data) return res.sendStatus(401);

                // admin
                if (payload.role === role.ADMIN) {
                    if (data.role === role.ADMIN) {
                        if (req.method === 'POST')
                            return validate(createProductSchema)(req, res, (err) => {
                                if (err) return; // `validate` a déjà envoyé une réponse en cas d'erreur
                                next();
                            });
                        if (req.method === 'PUT')
                            return validate(updateProductSchema)(req, res, (err) => {
                                if (err) return; // `validate` a déjà envoyé une réponse en cas d'erreur
                                next();
                            });
                        return next();
                    } else {
                        return res.sendStatus(403);
                    }
                }
                // non admin
                if (req.method === 'GET') {
                    // un utilisateur non-admin ne peut voir que ses infos
                    // const id = req.params.id;
                    // // pas d'id → il essaie de voir tous les commandes
                    // if (!id) return res.sendStatus(403);
                    // if (data.id !== id) return res.sendStatus(403);
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