import { Sequelize } from "sequelize"
import mongoose from 'mongoose'

async function connectPostgres(sequelize) {
    try {
    await sequelize.authenticate();
    console.log('Postgres connected.');
    return
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export const sequelize = new Sequelize(`${process.env.DATABASE_URL}`, {define: { freezeTableName: true }});

connectPostgres(sequelize);


(async () => {
  await sequelize.sync({ force: true }); // Utilisation de force: true pour recréer la table à chaque fois
  console.log("Toutes les tables ont été crées !");
})();

async function connectMongoDB(mongoUrl) {
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectMongoDB(process.env.MONGO_URL);