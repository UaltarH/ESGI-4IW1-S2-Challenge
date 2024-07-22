const { z } = require("zod");
const { invalidStringMessage } = require("./formMessages");

const productModifySchema = z.object({
  name: z.string({ invalid_type_error: invalidStringMessage })
    .min(1, { message: "Le nom est requis" }).optional(),

  description: z.string({ invalid_type_error: invalidStringMessage })
    .optional(),

  price: z.string({ invalid_type_error: invalidStringMessage })
    .regex(/^\d+(?:\.\d{2})?$/, { message: "Le prix doit être composé de chiffres au format 0000 ou 0000.00" })
    .optional(),

  stock: z.number().int().optional(),

  categoryId: z.string({ invalid_type_error: invalidStringMessage })
    .min(1, { message: "L'ID de catégorie est requis" })
    .optional(),

  categoryName: z.string({ invalid_type_error: invalidStringMessage })
    .optional(),
  threshold: z.number().int().optional(),
  imagePath: z.string({ invalid_type_error: invalidStringMessage }).optional(),
});

module.exports = productModifySchema;
