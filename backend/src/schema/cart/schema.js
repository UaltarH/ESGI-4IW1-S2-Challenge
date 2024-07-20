const { z } = require("zod");
const { requiredMessage, invalidStringMessage,invalidNumberMessage } = require("../formMessages");

// Schéma global combiné
const cartSchema = z.object({
  id: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(36, { message: "L'id doit contenir 36 caractères" })
    .max(36, { message: "L'id doit contenir 36 caractères" }),

  UserId: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(36, { message: "L'id doit contenir 36 caractères" })
    .max(36, { message: "L'id doit contenir 36 caractères" }),

  products: z.array(z.object({

    quantity: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .int({ message: "La quantité doit être un nombre entier" })
      .min(1, { message: "La quantité doit être au moins de 1" })
      .max(10, { message: "La quantité doit être au maximum de 10" }),

    postgresId: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage }),

    name: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
      .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
      .max(50, { message: "Le nom doit contenir au maximum 50 caractères" }),

    description: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
      .min(2, { message: "La description doit contenir au moins 2 caractères" })
      .max(255, { message: "La description doit contenir au maximum 255 caractères" }),

    size: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
        .min(1, { message: "La taille doit contenir au moins 2 caractères" })
        .max(10, { message: "La taille doit contenir au maximum 10 caractères" }),

    price: z.coerce.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
        .min(0, { message: "Le prix doit être au moins de 0" }),
  })).optional(),
});

module.exports = cartSchema;