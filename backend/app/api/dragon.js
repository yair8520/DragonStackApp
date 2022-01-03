const { Router } = require("express");
const AccountTable = require("../account/table");
const AccountDragonTable = require("../accountDragon/table");
const Breeder = require("../dragon/breeder");
const { getPublicDragons, getDragonWithTraits } = require("../dragon/helper");
const DragonTable = require("../dragon/table");
const { authenticatedAccount } = require("./helper");

const router = new Router();
router.get("/new", (req, res, next) => {
  let accountId, dragon;

  authenticatedAccount({ sessionString: req.cookies.sessionString })
    .then(({ account }) => {
      accountId = account.id;
      dragon = req.app.locals.engine.generation.newDragon({accountId});
      return DragonTable.storeDragon(dragon);
    })
    .then(({ dragonId }) => {
      dragon.dragonId = dragonId;

      return AccountDragonTable.storeAccountDragon({ accountId, dragonId });
    })
    .then(() => res.json({ dragon }))
    .catch((error) => {
      next(error);
    });
});

router.put("/update", (req, res, next) => {
  const { dragonId, nickname, isPublic, saleValue, sireValue } = req.body;
  DragonTable.updateDragon({
    dragonId,
    nickname,
    isPublic,
    saleValue,
    sireValue,
  })
    .then(() => res.json({ message: "successfuly update dragon name" }))
    .catch((error) => next(error));
});

router.get("/public-dragons", (req, res, next) => {
  getPublicDragons()
    .then(({ dragons }) => res.json({ dragons }))
    .catch((error) => next(error));
});

router.post("/buy", (req, res, next) => {
  const { dragonId, saleValue } = req.body;
  let buyerId;
  DragonTable.getDragon({ dragonId })
    .then((dragon) => {
      if (dragon.saleValue !== saleValue) {
        throw new Error("inncorrect sale value!");
      }

      if (!dragon.isPublic) {
        throw new Error("dragon must be public!");
      }

      return authenticatedAccount({ sessionString: req.cookies.sessionString });
    })
    .then(({ account, authenticated }) => {
      if (!authenticated) {
        throw new Error("Unauthenticated!");
      }
      if (saleValue > account.balance) {
        throw new Error("saleValue exceeds balance!");
      }
      buyerId = account.id;
      return AccountDragonTable.getDragonAccount({ dragonId });
    })
    .then(({ accountId }) => {
      if (accountId === buyerId) {
        throw new Error("cannot buy your own Dragon!");
      }
      const sellerId = accountId;

      return Promise.all([
        AccountTable.updateBalance({
          accountId: buyerId,
          value: -saleValue,
        }),
        AccountTable.updateBalance({
          accountId: sellerId,
          value: saleValue,
        }),
        AccountDragonTable.updateDragonAccount({
          dragonId,
          accountId: buyerId,
        }),
        DragonTable.updateDragon({
          dragonId,
          isPublic: false,
        }),
      ]);
    })
    .then(() => res.json({ message: "seccess" }))
    .catch((error) => next(error));
});
router.post("/mate", (req, res, next) => {
  const { matronDragonId, patronDragonId } = req.body;
  if (matronDragonId === patronDragonId)
    throw new Error("Cannot breed with the same dragon");

  let matronDragon, patronDragon, patronSireValue;
  let matronAccountId, PatronAccountId;

  getDragonWithTraits({ dragonId: patronDragonId })
    .then((dragon) => {
      if (!dragon.isPublic) {
        throw new Error("dragon must be public");
      }

      patronDragon = dragon;
      patronSireValue = dragon.sireValue;

      return getDragonWithTraits({ dragonId: matronDragonId });
    })
    .then((dragon) => {
      matronDragon = dragon;

      return authenticatedAccount({ sessionString: req.cookies.sessionString });
    })
    .then(({ account, authenticated }) => {
      if (!authenticated) throw new Error("Unauthenticated");

      if (patronSireValue > account.balance) {
        throw new Error("Sire Value exceedes balance");
      }

      matronAccountId = account.id;

      return AccountDragonTable.getDragonAccount({ dragonId: patronDragonId });
    })
    .then(({ accountId }) => {
      PatronAccountId = accountId;
      if (matronAccountId === PatronAccountId) {
        throw new Error("cannot breed your own dragons!");
      }

      const dragon = Breeder.breedDragon({
        matron: matronDragon,
        patron: patronDragon,
      });

      return DragonTable.storeDragon(dragon);
    })
    .then(({ dragonId }) => {
       Promise.all([
        AccountTable.updateBalance({
          accountId: matronAccountId,
          value: -patronSireValue,
        }),
        AccountTable.updateBalance({
          accountId: PatronAccountId,
          value: patronSireValue,
        }),
        AccountDragonTable.storeAccountDragon({
          dragonId,
          accountId: matronAccountId,
        }),
      ])
        .then(() => res.json({ message: "success!" }))
        .catch((error) => next(error));
    });
});
module.exports = router;
