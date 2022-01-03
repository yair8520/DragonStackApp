const { response } = require("express");
const pool = require("../../databasePool");
const DragonTraitTable = require("../dragonTrait/table");

class DragonTable {
  static storeDragon(dragon) {
    const {
      birthDate,
      nickname,
      generationId,
      isPublic,
      saleValue,
      sireValue,
    } = dragon;
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO dragon(birthdate, nickname, "generationId","isPublic","saleValue","sireValue")
              VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
        [birthDate, nickname, generationId, isPublic, saleValue, sireValue],
        (error, response) => {
          if (error) return reject(error);

          const dragonId = response.rows[0].id;

          //array of promises after all we resolve
          Promise.all(
            dragon.traits.map(({ traitType, traitValue }) => {
              return DragonTraitTable.storeDragonTrait({
                dragonId,
                traitType,
                traitValue,
              });
            })
          )
            .then(() => resolve({ dragonId }))
            .catch((error) => reject(error));
        }
      );
    });
  }
  static getDragon({ dragonId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT birthdate, nickname, "generationId","isPublic","saleValue","sireValue"
        FROM dragon
        WHERE dragon.id=$1`,
        [dragonId],
        (error, response) => {
          if (error) return reject(error);

          if (response.rows.length === 0) return reject(new Error("no dragon"));

          resolve(response.rows[0]);
        }
      );
    });
  }

  static updateDragon({ dragonId, nickname, isPublic, saleValue ,sireValue}) {
    const settingsMap = { nickname, isPublic, saleValue,sireValue };

    const validQueries = Object.entries(settingsMap).filter(
      ([settingsKey, settingsValue]) => {
        if (settingsValue !== undefined) {
          return new Promise((resolve, reject) => {
            pool.query(
              `UPDATE dragon SET "${settingsKey}" = $1  WHERE id = $2 `,
              [settingsValue, dragonId],
              (error, response) => {
                // console.log("updateId --> ", response.rows[0].id);
                if (error) return reject(error);
                resolve();
              }
            );
          });
        }
      }
    );
    return Promise.all(validQueries);
  }
}
// DragonTable.updateDragon({ dragonId: 1, nickname: "fooby" })
//   .then(() => console.log("update dragon"))
//   .catch((error) => console.error("error", error));
//node app/dragon/table.js
module.exports = DragonTable;
