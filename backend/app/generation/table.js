const pool = require("../../databasePool");
const GenerationEngine = require("./engion");

class GenerateTable {
  static storGeneration(generation) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO generation(expiration) VALUES($1) RETURNING id",
        [generation.expiration],
        (error, res) => {
          if (error) return reject(error);

          const generationId = res.rows[0].id;
          resolve({ generationId });
        }
      );
    });
  }
}

module.exports = GenerateTable;
