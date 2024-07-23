const { z } = require("zod");
const { invalidStringMessage, requiredMessage } = require("../formMessages");

const updateProductSchema = z.object({
    name: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
        .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
        .max(50, { message: "Le nom doit contenir au maximum 50 caractères" })
        .optional(),

    description: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
        .min(2, { message: "La description doit contenir au moins 2 caractères" })
        .max(550, { message: "La description doit contenir au maximum 550 caractères" })
        .optional(),

    price: z.number({ required_error: requiredMessage })
        .min(1, { message: "Le prix doit être d'au moins 1" })
        .max(999, { message: "Le prix ne peut pas dépasser 999" })
        .optional(),

    imagePath: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
        .min(1, { message: "Le chemin de l'image doit contenir au moins 1 caractère" })
        .max(50, { message: "Le chemin de l'image doit contenir au maximum 50 caractères" })
        .optional(),

    CategoryId: z.string({ invalid_type_error: invalidStringMessage })
        .min(1, { message: "L'ID de catégorie est requis" })
        .optional(),
});

module.exports = updateProductSchema;
