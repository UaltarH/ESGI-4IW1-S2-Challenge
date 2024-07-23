const { z } = require("zod");

const { requiredMessage, invalidStringMessage } = require("../formMessages");


const loginSchema = z.object({
email: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
.email({ message: "L'email doit être valide" })
.min(5, { message: "L'email doit contenir au moins 5 caractères" })
.max(50, { message: "L'email doit contenir au maximum 50 caractères" }),

password: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
.min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" })
.max(50, { message: "Le mot de passe doit contenir au maximum 50 caractères" })
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/, { message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@,$,!,%,*,?,&)" }),
});

module.exports = loginSchema;