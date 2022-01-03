const pool = require("../databasePool");
const TRAITS = require("../data/traits.json");

TRAITS.forEach((TRAIT) => {
  const traitType = TRAIT.type;
  const traitValue = TRAIT.values;

  traitValue.forEach((traitValue) => {
    pool.query(
      `INSERT INTO trait("traitType","traitValue")
            VALUES($1, $2)
            RETURNING id`,
      [traitType, traitValue],
      (error, response) => {
        if (error) console.log(error);

          const traitId = response.rows[0].id;
          
        console.log(`inserted traits-id:  ${traitId}`);
      }
    );
  });
});
