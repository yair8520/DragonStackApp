const { Pool } = require("pg");
const databaseConfig = require("./secrests/databaseConfig");

const pool = new Pool(databaseConfig);

module.exports = pool;

console.log("test")
 