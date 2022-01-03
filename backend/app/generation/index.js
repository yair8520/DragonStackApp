const { REFRESH_RATE, SECONDS } = require("../config");

const Dragon = require("../dragon");

const refreshRate = REFRESH_RATE * SECONDS;
class Generations {
  constructor() {
    this.accountId = new Set();
    this.expiration = this.calculateExpiartions();
    this.generationId = undefined; //will come from the table aftr insert
  }
  calculateExpiartions() {
    this.expiration = null;

    const expirationPeriod = Math.floor(Math.random() * (refreshRate / 2));

    const msUntilExpiration =
      Math.random() < 0.5
        ? refreshRate - expirationPeriod
        : refreshRate + expirationPeriod;
    return new Date(Date.now() + msUntilExpiration);
  }

  newDragon({ accountId }) {
    if (Date.now() > this.expiration) {
      throw new Error(`This generation expired on ${this.expiration}`);
    }
    if (this.accountId.has(accountId))
      throw new Error("you already have dragon from this generation");

    this.accountId.add(accountId);

    return new Dragon({ generationId: this.generationId });
  }
}
module.exports = Generations;
