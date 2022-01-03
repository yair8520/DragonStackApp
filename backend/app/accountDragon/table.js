const pool = require("../../databasePool");

class AccountDragonTable {
  static storeAccountDragon({ accountId, dragonId }) {
    console.log("store");
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO accountDragon("accountId", "dragonId") VALUES($1, $2)',
        [accountId, dragonId],
        (error, response) => {
          if (error) return reject(error);
          console.log("stroe account dragon");
          resolve();
        }
      );
    });
  }
  static getAccountDragons({ accountId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT "dragonId" FROM accountDragon WHERE "accountId"=$1',
        [accountId],
        (error, response) => {
          if (error) return reject(error);

          resolve({ accountDragons: response.rows });
        }
      );
    });
  }
  static getDragonAccount({ dragonId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT "accountId" FROM accountDragon WHERE "dragonId"=$1',
        [dragonId],
        (error, response) => {
          if (error) return reject(error);

          resolve({ account: response.rows[0].accountId });
        }
      );
    });
  }
  static updateDragonAccount({ dragonId, accountId }) {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE accountDragon SET "accountId"=$1 WHERE "dragonId"=$2',
        [accountId, dragonId],
        (error, response) =>  {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

// AccountDragonTable.getAccountDragons({dragonId: 1})
//   .then(({accountId}) => console.log("accountId",accountId))
//   .catch((error) => console.error("error", error));


//   AccountDragonTable.updateDragonAccount({dragonId: 2,accountId:2})
//   .then(() => console.log("good"))
//   .catch((error) => console.error("error", error));




module.exports = AccountDragonTable;

//node app/accountDragon/table.js
