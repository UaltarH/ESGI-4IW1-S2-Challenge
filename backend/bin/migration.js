#!/usr/bin/env node

const {connection} = require("../src/sequelize/models");

connection
  .sync()
  .then(() => console.log("Database synchronized successfully."))
  .then(() => connection.close())
  .catch((error) => console.error("An error occurred while synchronizing the database:", error));
