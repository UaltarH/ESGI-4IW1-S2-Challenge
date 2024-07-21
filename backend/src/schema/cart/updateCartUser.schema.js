const { z } = require("zod");
const { requiredMessage, invalidStringMessage,invalidNumberMessage } = require("../formMessages");

const updateCartUserSchema = z.object({
  id: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(36, { message: "L'id doit contenir 36 caractères" })
    .max(36, { message: "L'id doit contenir 36 caractères" }),

  UserId: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(36, { message: "L'id doit contenir 36 caractères" })
    .max(36, { message: "L'id doit contenir 36 caractères" }),
});

module.exports = updateCartUserSchema;