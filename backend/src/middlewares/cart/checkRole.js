const jwt = require('jsonwebtoken');
const { findByPk } = require("../../services/crudGeneric");
const { Cart, Cart_item, User } = require('../../sequelize/models/');
const validate = require("./../validate");
const role = require("../../dto/role.dto");
const {
    cartSchema,
} = require("../../schema/");

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
                const {data: user, error} = await findByPk(User, payload.id);
                if (!user) return res.sendStatus(401);
                if (error) return res.sendStatus(500);

                if (req.method === 'POST') {
                    if (req.body.UserId !== user.id) return res.sendStatus(403);
                    else {
                        return validate(cartSchema)(req, res, next);
                    }
                } else if (req.method === 'PUT') {
                    if (req.body.UserId !== user.id) return res.sendStatus(403);
                    // vérifier que le panier existe et que c'est bien le sien
                    const {data: cart, error} = await findByPk(Cart, req.body.id);
                    if (!cart) return res.sendStatus(404);
                    if (cart.UserId !== req.body.UserId) return res.sendStatus(403);
                    if (error) return res.sendStatus(500);

                    return validate(cartSchema)(req, res, next);
                } else if (req.method === 'DELETE') {
                    if(req.query.UserId !== user.id) return res.sendStatus(403);
                    const {data: cart, error} = await findByPk(Cart, req.params.id);
                    if (!cart) return res.sendStatus(404);
                    if (cart.UserId !== req.query.UserId) return res.sendStatus(403);
                    if (error) return res.sendStatus(500);

                    return validate(cartSchema)(req, res, next);
                } else if (req.method === 'GET') {
                    // un utilisateur non-admin ne peut voir que ses infos
                    const id = req.params.id;
                    // pas d'id → il essaie de voir le panier de tous les utilisateurs ou il fetch par id du panier
                    if (!id) return res.sendStatus(403);
                    if (user.id !== id) return res.sendStatus(403);
                    return next();
                } else {
                    return res.sendStatus(400);
                }
            } catch (e) {
                return res.sendStatus(401);
            }
        } else {
            return res.sendStatus(401);
        }
    }
}
module.exports = checkRole;