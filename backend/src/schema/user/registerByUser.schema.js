const { z } = require("zod");

const role = require("../../dto/role.dto");
const { requiredMessage, invalidStringMessage, invalidDateMessage } = require("../formMessages");

// Dates pour la validation de la date de naissance
const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 120));
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

// Schéma global combiné
const registerByUserSchema = z.object({
  lastname: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom doit contenir au maximum 50 caractères" }),

  firstname: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le prénom doit contenir au maximum 50 caractères" }),

  email: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .email({ message: "L'email doit être valide" })
    .min(5, { message: "L'email doit contenir au moins 5 caractères" })
    .max(50, { message: "L'email doit contenir au maximum 50 caractères" }),

  password: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
    .max(50, { message: "Le mot de passe doit contenir au maximum 50 caractères" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),

  birthdate: z.coerce.date({ required_error: requiredMessage, invalid_type_error: invalidDateMessage })
    .min(minDate, { message: "Vous devez avoir au maximum 120 ans" })
    .max(maxDate, { message: "Vous devez avoir au moins 18 ans" }),

  address: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(5, { message: "L'adresse doit contenir au moins 5 caractères" })
    .max(100, { message: "L'adresse doit contenir au maximum 100 caractères" }),

  zipcode: z.coerce.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(5, { message: "Le code postal doit contenir 5 chiffres" })
    .max(5, { message: "Le code postal doit contenir 5 chiffres" })
    .regex(/^\d{5}$/, { message: "Le code postal doit contenir 5 chiffres" }),

  city: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(2, { message: "La ville doit contenir au moins 2 caractères" })
    .max(50, { message: "La ville doit contenir au maximum 50 caractères" }),

  country: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(2, { message: "Le pays doit contenir au moins 2 caractères" })
    .max(50, { message: "Le pays doit contenir au maximum 50 caractères" }),

  phone: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .regex(/^0[1-9]\d{8}$/, { message: "Le téléphone doit être au format 0XXXXXXXXX" }),

});

module.exports = registerByUserSchema;