const jwt = require('jsonwebtoken');
const { findByPk } = require("../../services/crudGeneric");
const { Cart, Cart_item, User } = require('../../sequelize/models/');
const validate = require("./../validate");
const role = require("../../dto/role.dto");
const {
    updateCartUserSchema,
    updateCartByUserSchema,
    updateCartByGuestSchema,
    createCartByUserSchema,
    createCartByGuestSchema,
} = require("../../schema/");

const checkRole = () => async (req, res, next) => {
    const header = req.headers.Authorization ?? req.headers.authorization;
    if (!header) {
        if(req.method === 'GET') {
            const {data: cart, error} = await findByPk(Cart, req.params.id);
            if (!cart) return res.sendStatus(404);
            if (error) return res.sendStatus(500);
            if (cart.UserId !== null) return res.sendStatus(403);
            return next();
        }
        if(req.method === 'POST') return validate(createCartByGuestSchema)(req, res, next);
        if(req.method === 'DELETE') {
            const {data: cart, error} = await findByPk(Cart, req.params.id);
            if (!cart) return res.sendStatus(404);
            if (cart.UserId !== null) return res.sendStatus(403);
            if (error) return res.sendStatus(500);
            return next();
        }
        if(req.method === 'PUT') return validate(updateCartByGuestSchema)(req, res, next);
        return res.sendStatus(400);
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
                    return validate(createCartByUserSchema)(req, res, next);
                } else if (req.method === 'PATCH'){
                    if (req.body.UserId !== user.id) return res.sendStatus(403);
                    const {data: cart, error} = await findByPk(Cart, req.body.id);
                    if (!cart) return res.sendStatus(404);
                    if(cart.UserId !== null) return res.sendStatus(403);
                    return validate(updateCartUserSchema)(req, res, next);
                } else if (req.method === 'PUT') {
                    // vérifier que le panier existe et que c'est bien le sien
                    const {data: cart, error} = await findByPk(Cart, req.body.id);
                    if (!cart) return res.sendStatus(404);
                    if (cart.UserId !== user.id) return res.sendStatus(403);
                    if (error) return res.sendStatus(500);

                    return validate(updateCartByUserSchema)(req, res, next);
                } else if (req.method === 'DELETE') {
                    const {data: cart, error} = await findByPk(Cart, req.params.id);
                    if (!cart) return res.sendStatus(404);
                    if (cart.UserId !== user.id) return res.sendStatus(403);
                    if (error) return res.sendStatus(500);
                    return next();
                } else if (req.method === 'GET') {
                    // un utilisateur non-admin ne peut voir que ses infos
                    const id = req.params.id;
                    // pas d'id → il essaie de voir le panier de tous les utilisateurs ou il fetch par id du panier
                    if (!id) return res.sendStatus(400);
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