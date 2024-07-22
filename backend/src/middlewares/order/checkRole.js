const jwt = require('jsonwebtoken');
const { findByPk } = require("../../services/crudGeneric");
const { User, Order } = require('../../sequelize/models/');
const validate = require("./../validate");
const role = require("../../dto/role.dto");

const checkRole = () => async (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header) {
        if (req.method === 'POST' && req.path === '/orders/payment') {
            req.body.role = role.USER;
            return next();
        }
        return res.sendStatus(401);
    }

    const [type, token] = header.split(/\s+/);
    if (type !== "Bearer") return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { data, error } = await findByPk(User, payload.id);
        if (error || !data) {
            // id envoyé est celui de la commande pas du user
            if (req.path.startsWith('/orders/')) {
                // Non-admin peut télécharger ses propres factures
                const id = req.params.id;
                const { data: order, error: orderError } = await findOne(Order, { id, UserId: userId });
                if (orderError || !order) return res.sendStatus(403);
                return next();
            } else {
                return res.sendStatus(401);
            }
        }

        const isAdmin = payload.role === role.ADMIN;
        const userId = data.id;

        // admin
        if (isAdmin) {
            if (req.method === 'GET') {
                return next();
            } else if (req.method === 'POST') {
                if (req.path === '/orders/updateShippingStatus') {
                    return next();
                }
                return next();
            } else if (req.method === 'PATCH') {
                return next();
            } else {
                return res.sendStatus(403);
            }
        }

        // non admin
        if (!isAdmin) {
            if (req.method === 'GET') {
                if (req.path.startsWith('/orders/user/')) {
                    // Non-admin peut voir ses propres commandes
                    const id = req.params.id;
                    if (userId !== id) return res.sendStatus(403);
                } else if (req.path === '/orders') {
                    return res.sendStatus(403);
                } 
                return next();
            } else if (req.method === 'POST') {
                if (req.path === '/orders/payment') {
                    // Non-admin peut créer une commande (seulement accessible pour les utilisateurs authentifiés)
                    return next();
                }
                return res.sendStatus(403);
            } else {
                return res.sendStatus(403);  
            }
        }
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

module.exports = checkRole;
