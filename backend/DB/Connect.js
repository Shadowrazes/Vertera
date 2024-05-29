import MySQL from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const isBuild = process.argv[2] === "build";

const Pool = MySQL.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: isBuild ? process.env.DB_USER_PROD : process.env.DB_USER_DEV,
  password: isBuild
    ? process.env.DB_PASSWORD_PROD
    : process.env.DB_PASSWORD_DEV,
  database: isBuild ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV,
  namedPlaceholders: true,
}).promise();

export default Pool;
