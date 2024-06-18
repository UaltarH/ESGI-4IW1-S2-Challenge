module.exports =  {
  "development": {
    "define": {
      "freezeTableName": true, // N'ajoute pas de 's' à la fin des noms de table
    },
    "url": process.env.DATABASE_URL,
  },
  "production": {
    "username": process.env.POSTGRES_PASSWORD,
    "password": process.env.POSTGRES_USER,
    "database": process.env.POSTGRES_DB,
    "host": process.env.DB_HOST,
    "dialect": process.env.DIALECT,
  },
}