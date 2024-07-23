const jwt = require('jsonwebtoken');
const { findByPk } = require("../../services/crudGeneric");
const { User } = require('../../sequelize/models/');
const validate = require("./../validate");
const role = require("../../dto/role.dto");
const { dashboardConfigSchema, widgetValidationSchema } = require("../../schema/");

const checkRole = () => async (req, res, next) => {
    const header = req.headers.Authorization ?? req.headers.authorization;
    if (!header) {
        return res.sendStatus(401);
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
                        if (req.method === 'PUT')
                            return validate(widgetValidationSchema)(req, res, (err) => {
                                if (err) return;
                                next();
                            });
                        if (req.method === 'POST')
                            return validate(dashboardConfigSchema)(req, res, (err) => {
                                if (err) return; 
                                next();
                            });
                        return next();
                    } else {
                        return res.sendStatus(403);
                    }
                }
                // non admin
                return res.sendStatus(403)
            } catch (e) {
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(401);
        }
    }
}
module.exports = checkRole;