const { z } = require('zod');

const { requiredMessage, invalidStringMessage, invalidNumberMessage } = require("../formMessages");

const widgetsArraySchema = z.object({
  idWidget: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(1, { message: "L'ID du widget doit contenir au moins 1 caractère" }),
  grid: z.object({
    x: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(0, { message: "La position x doit être au moins de 0" }),
    y: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(0, { message: "La position y doit être au moins de 0" }),
    w: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(1, { message: "La largeur doit être au moins de 1" }),
    h: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(1, { message: "La hauteur doit être au moins de 1" }),
  }),
});

const widgetValidationSchema = z.object({
  widgets: z.array(widgetsArraySchema)
});

module.exports = widgetValidationSchema;
