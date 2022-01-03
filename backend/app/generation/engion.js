const Generation = require("./index");
const GenerateTable = require("./table");

class GenerationEngine {
  constructor() {
    this.generation = null;
    this.timer = null;
  }
  start() {
    this.buildNewGeneration();
  }
  stop() {
    clearTimeout(this.timer);
  }
  buildNewGeneration() {
    const generation = new Generation();

    //storGeneration is static func
    //update generationId from table
    GenerateTable.storGeneration(generation)
      .then(({ generationId }) => {
        this.generation = generation;
        this.generation.generationId = generationId;

        //console.log(this.generation);

        // will recursively call itself once the current generation has expired.
        this.timer = setTimeout(
          () => this.buildNewGeneration(),

          this.generation.expiration.getTime() - Date.now()
        );
      })
      .catch((error) => console.error(error));
  }
}
module.exports = GenerationEngine;
//Createdb -U postgres dragonstackdb
//CREATE USER node_user WITH SUPERUSER PASSWORD 'postgres'
// SELECT * FROM pg_user
//./node_modules/nodemon/bin/nodemon.js databasePool.js
