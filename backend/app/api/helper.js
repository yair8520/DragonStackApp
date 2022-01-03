const { hash } = require("../account/helper");
const Session = require("../account/session");
const AccountTable = require("../account/table");

const setSession = ({ username, res, sessionId }) => {
  return new Promise((resolve, reject) => {
    let session, sessionString;
    if (sessionId) {
      console.log("sessionId true", sessionId);
      sessionString = Session.sessionString({ username, id: sessionId });
      setSessionCookie({ sessionString, res });
      resolve({ message: "session restored" });
    } else {
      console.log("sessionId false", sessionId);

      session = new Session({ username });
      sessionString = session.toString();
      AccountTable.updateSessionId({
        sessionId: session.id,
        usernameHash: hash(username),
      })
        .then(() => {
          setSessionCookie({ sessionString, res });
          resolve({ message: "session created" });
        })
        .catch((error) => reject(error));
    }
  });
};

const setSessionCookie = ({ sessionString, res }) => {
  res.cookie("sessionString", sessionString, {
    expire: Date.now() + 3600000,
    httpOnly: true, //only for backend
    // secure: true,  //only on https
  });
};
const authenticatedAccount = ({ sessionString }) => {
  return new Promise((resolve, reject) => {
    if (!sessionString || !Session.verify(sessionString)) {
      const error = new Error("Invalid Session");
      error.statusCode = 400;
      return reject(error);
    } else {
      const { username, id } = Session.parse(sessionString);

      AccountTable.getAccount({ usernameHash: hash(username) })
        .then(({ account }) => {
          const authenticated = account.sessionId === id;
          resolve({ account, authenticated ,username});
        })
        .catch((error) => reject(error));
    }
  });
};

module.exports = { setSession, authenticatedAccount };
