const { z } = require("zod");
const { requiredMessage, invalidStringMessage, invalidDateMessage } = require("../formMessages");
// Dates pour la validation de la date de naissance
const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 120));
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));


const updateByAdminSchema = z.object({
  lastname: z.string({ invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom doit contenir au maximum 50 caractères" })
    .optional(),

  firstname: z.string({ invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le prénom doit contenir au maximum 50 caractères" })
    .optional(),

  birthdate: z.coerce.date({ required_error: requiredMessage, invalid_type_error: invalidDateMessage })
      .min(minDate, { message: "Vous devez avoir au maximum 120 ans" })
      .max(maxDate, { message: "Vous devez avoir au moins 18 ans" }),

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
    .optional()
});

module.exports = updateByAdminSchema;
