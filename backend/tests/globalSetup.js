const db = require("../src/sequelize/models");
const mongoose = require('mongoose');

module.exports = async () => {
  await db.sequelize.sync({ force: true });
  await mongoose.connect(process.env.MONGO_URL);
  
  // Stockez les références globalement si nécessaire
  global.__DB__ = db;
  global.__MONGOOSE__ = mongoose;
};