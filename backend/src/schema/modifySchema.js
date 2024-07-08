const { z } = require("zod");

const invalidStringMessage = 'Ce champ doit être une chaîne de caractères';

const modifySchema = z.object({
  lastname: z.string({ invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom doit contenir au maximum 50 caractères" })
    .optional(),

  firstname: z.string({ invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le prénom doit contenir au maximum 50 caractères" })
    .optional(),

  address: z.string({ invalid_type_error: invalidStringMessage })
    .min(5, { message: "L'adresse doit contenir au moins 5 caractères" })
    .max(100, { message: "L'adresse doit contenir au maximum 100 caractères" })
    .optional(),

  zipcode: z.string({ invalid_type_error: invalidStringMessage })
    .min(5, { message: "Le code postal doit contenir 5 chiffres" })
    .max(5, { message: "Le code postal doit contenir 5 chiffres" })
    .regex(/^\d{5}$/, { message: "Le code postal doit contenir 5 chiffres" })
    .optional(),

  city: z.string({ invalid_type_error: invalidStringMessage })
    .min(2, { message: "La ville doit contenir au moins 2 caractères" })
    .max(50, { message: "La ville doit contenir au maximum 50 caractères" })
    .optional(),

  country: z.string({ invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le pays doit contenir au moins 2 caractères" })
    .max(50, { message: "Le pays doit contenir au maximum 50 caractères" })
    .optional(),

  phone: z.string({ invalid_type_error: invalidStringMessage })
    .regex(/^0[1-9]\d{8}$/, { message: "Le téléphone doit être au format 0XXXXXXXXX" })
    .optional()
});

module.exports = modifySchema;
