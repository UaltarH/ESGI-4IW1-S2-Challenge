module.exports = {
  development: {
    define: {
      freezeTableName: true, // N'ajoute pas de 's' à la fin des noms de table
    },
    url: process.env.DATABASE_URL,
  },
  test: {
    define: {
      freezeTableName: true,
    },
    url: process.env.TEST_DATABASE_URL, // URL de la base de données de test
  },
}
