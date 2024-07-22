const { z } = require('zod');

const { requiredMessage, invalidStringMessage, invalidNumberMessage } = require("../formMessages");

// Schéma global combiné pour DashboardConfig
const dashboardConfigSchema = z.object({
  title: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(5, { message: "Le titre doit contenir au moins 5 caractères" })
    .max(100, { message: "Le titre doit contenir au maximum 100 caractères" }),

  description: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(5, { message: "La description doit contenir au moins 5 caractères" })
    .max(500, { message: "La description doit contenir au maximum 500 caractères" })
    .optional(),

  chartType: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(1, { message: "Le type de graphique doit contenir au moins 1 caractère" })
    .max(50, { message: "Le type de graphique doit contenir au maximum 50 caractères" }),

  dataSource: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(1, { message: "La source de données doit contenir au moins 1 caractère" })
    .max(100, { message: "La source de données doit contenir au maximum 100 caractères" }),

  indexField: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(1, { message: "L'index des données doit contenir au moins 1 caractère" })
    .max(100, { message: "L'index des données doit contenir au maximum 100 caractères" }),

    categoryField1: z.string({ required_error: requiredMessage, invalid_type_error: invalidStringMessage })
    .min(1, { message: "La categorie ne peux pas etre vide" }),

    w: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(1, { message: "La largeur doit être au moins de 1" }),

    h: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(1, { message: "La hauteur doit être au moins de 1" }),

    x: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(0, { message: "La position x doit être au moins de 0" }),

    y: z.number({ required_error: requiredMessage, invalid_type_error: invalidNumberMessage })
      .min(0, { message: "La position y doit être au moins de 0" }),
});

module.exports = dashboardConfigSchema;
