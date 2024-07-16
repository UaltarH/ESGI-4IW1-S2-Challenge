module.exports = {
  "development": {
    "define": {
      "freezeTableName": true, // N'ajoute pas de 's' à la fin des noms de table
    },
    "url": process.env.DATABASE_URL,
  },
}
