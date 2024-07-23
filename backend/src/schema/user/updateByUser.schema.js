const { z } = require("zod");
const { requiredMessage, invalidStringMessage } = require("../formMessages");

const updateByUserSchema = z.object({
  address: z.string({ invalid_type_error: invalidStringMessage })
    .min(5, { message: "L'adresse doit contenir au moins 5 caractères" })
    .max(100, { message: "L'adresse doit contenir au maximum 100 caractères" })
    .optional(),

  zipcode: z.coerce.string({ invalid_type_error: invalidStringMessage })
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
    .optional(),

  password: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage }),

  newPassword: z.string({ invalid_type_error: invalidStringMessage })
    .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
    .max(50, { message: "Le mot de passe doit contenir au maximum 50 caractères" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" })
    .optional(),
});

module.exports = updateByUserSchema;
