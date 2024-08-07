const { z } = require("zod");
const { invalidStringMessage, requiredMessage } = require("../formMessages");

const createProductSchema = z.object({
  name: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom doit contenir au maximum 50 caractères" }),

  description: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(2, { message: "La description doit contenir au moins 2 caractères" })
    .max(550, { message: "La description doit contenir au maximum 550 caractères" }),

  price: z.number({ required_error: requiredMessage })
    .min(1, { message: "Le prix doit être d'au moins 1" })
    .max(999, { message: "Le prix ne peut pas dépasser 999" }),

  stock: z.number({ required_error: requiredMessage })
    .min(0, { message: "Le stock doit être d'au moins 0" })
    .max(999, { message: "Le stock ne peut pas dépasser 999" }),

  imagePath: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(1, { message: "Le chemin de l'image doit contenir au moins 1 caractère" })
    .max(50, { message: "Le chemin de l'image doit contenir au maximum 50 caractères" }),

  threshold: z.number({ required_error: requiredMessage })
    .min(0, { message: "Le seuil doit être d'au moins 0" })
    .max(999, { message: "Le seuil ne peut pas dépasser 999" }),

  categoryId: z.string({ invalid_type_error: invalidStringMessage })
    .min(1, { message: "L'ID de catégorie est requis" })
    .optional(),
});

module.exports = createProductSchema;
