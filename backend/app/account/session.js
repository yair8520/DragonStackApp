const { v4: uuidv4 } = require('uuid');
const { hash } = require("./helper");

const SEPERATOR = "|";

class Session {
  constructor({ username }) {
    this.username = username;
    this.id = uuidv4();
  }

  toString() {
    const { username, id } = this;
    return Session.sessionString({ username, id });
  }

  static parse(sessionString) {
    const sessionData = sessionString.split(SEPERATOR);
    return {
      username: sessionData[0],
      id: sessionData[1],
      sessionHash: sessionData[2],
    };
  }

  static verify(sessionString) {
    const { username, id, sessionHash } = Session.parse(sessionString);
    const accountData = Session.accountData({ username, id });

    return hash(accountData) === sessionHash;
  }

  static accountData({ username, id }) {
    return `${username}${SEPERATOR}${id}`;
  }

  //username|id|hash(username, id)
  static sessionString({ username, id }) {
    const accountData = Session.accountData({ username, id });
    return `${accountData}${SEPERATOR}${hash(accountData)}`;
  }
}
module.exports = Session;
