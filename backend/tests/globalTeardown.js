const { cartQueue, userQueue } = require("../src/config/queueBullConfig");

module.exports = async () => {
  console.log("Starting global teardown...");

  // Fermeture de Sequelize
  if (global.__DB__ && global.__DB__.sequelize) {
    console.log("Closing Sequelize connection...");
    await global.__DB__.sequelize.close();
    console.log("Sequelize connection closed.");
  } else {
    console.log("No Sequelize connection to close.");
  }

  // Fermeture de MongoDB
  if (global.__MONGOOSE__) {
    console.log("Closing Mongoose connection...");
    await global.__MONGOOSE__.disconnect();
    await global.__MONGOOSE__.connection.close(false);
    console.log("Mongoose connection closed.");
  } else {
    console.log("No Mongoose connection to close.");
  }

  // Vider et fermer les queues Bull
  console.log("Emptying and closing Bull queues...");
  try {
    await Promise.all([cartQueue.empty(), userQueue.empty(), cartQueue.close(), userQueue.close()]);
    console.log("Bull queues emptied and closed.");
  } catch (error) {
    console.error("Error closing Bull queues:", error);
  }

  // Nettoyage des timers
  const activeHandles = process._getActiveHandles();
  activeHandles.forEach((handle) => {
    if (handle instanceof setTimeout) {
      clearTimeout(handle);
    } else if (handle instanceof setInterval) {
      clearInterval(handle);
    }
  });

  console.log("Global teardown complete.");

  console.log("Forcing exit...");
  process.exit(0);
};
