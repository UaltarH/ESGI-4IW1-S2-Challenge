const connection = require("../sequelize/models/db.js");

sequelize
  .sync()
  .then(() => console.log("Database synchronized successfully."))
  .then(() => process.exit(0))
  .catch((error) => console.error("An error occurred while synchronizing the database:", error));
