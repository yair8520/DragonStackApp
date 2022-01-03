const { Router } = require("express");
const { hash } = require("../account/helper");
const Session = require("../account/session");
const AccountTable = require("../account/table");
const AccountDragonTable = require("../accountDragon/table");
const { getDragonWithTraits } = require("../dragon/helper");
const { setSession, authenticatedAccount } = require("./helper");

const router = new Router();

//store in account db hash pass and username
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  const passwordHash = hash(password);
  const usernameHash = hash(username);

  AccountTable.getAccount({ usernameHash })
    .then(({ account }) => {
      if (!account) {
        return AccountTable.storeAccount({ usernameHash, passwordHash });
      } else {
        const error = new Error("this user name is alreadt define!");
        error.statusCode = 409;
        throw error;
      }
    })
    .then(() => {
      return setSession({ username, res });
    })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});
//check if account in db ? set session :error(not signeup)
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  AccountTable.getAccount({ usernameHash: hash(username) })
    .then(({ account }) => {
      if (account && account.passwordHash === hash(password)) {
        const { sessionId } = account;

        return setSession({ username, res, sessionId });
      } else {
        const error = new Error("Incorrect username/ password");
        throw error;
      }
    })
    .then(({ message }) => res.json({ message }))
    .catch((error) => next(error));
});
router.get("/logout", (req, res, next) => {
  const { username } = Session.parse(req.cookies.sessionString);

  AccountTable.updateSessionId({
    sessionId: null,
    usernameHash: hash(username),
  })
    .then(() => {
      res.clearCookie("sessionString");
      res.json({ message: "Successful logout" });
    })
    .catch((error) => next(error));
});

router.get("/authenticated", (req, res, next) => {
  const { sessionString } = req.cookies;

  authenticatedAccount({ sessionString })
    .then(({ authenticated }) => {
      res.json({ authenticated });
    })
    .catch((error) => next(error));
});

router.get("/dragons", (req, res, next) => {
  const { sessionString } = req.cookies;

  authenticatedAccount({ sessionString })
    .then(({ account }) => {
      return AccountDragonTable.getAccountDragons({ accountId: account.id });
    })
    .then(({ accountDragons }) => {
      return Promise.all(
        accountDragons.map((accountDragons) => {
          return getDragonWithTraits({ dragonId: accountDragons.dragonId });
        })
      );
    })
    .then((dragons) => {
      res.json({ dragons });
    })
    .catch((error) => next(error));
});

router.get("/info", (req, res, next) => {
  const { sessionString } = req.cookies;

  authenticatedAccount({ sessionString })
    .then(({ account,username }) => {
      res.json({ info: { balance: account.balance,username } });
    })
    .catch((error) => next(error));
});

module.exports = router;
