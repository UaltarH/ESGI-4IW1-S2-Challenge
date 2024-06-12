import 'dotenv/config'

export default {
  "development": {
    "username": process.env.POSTGRES_PASSWORD,
    "password": process.env.POSTGRES_USER,
    "database": process.env.POSTGRES_DB,
    "host": process.env.DB_HOST,
    "dialect": process.env.DIALECT,
  }
}