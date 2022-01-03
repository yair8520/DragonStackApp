const GenerationEngine = require("./generation/engion");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// require routers for spesific route
const dragonRouter = require("./api/dragon");
const generationRouter = require("./api/generation");
const accountRouter = require("./api/account");

const express = require("express");
const AccountTable = require("./account/table");
const app = express();
const engion = new GenerationEngine();

//to pass to routers!
app.locals.engine = engion;
app.use(cors({ origin: "http://localhost:1234", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/dragon", dragonRouter);
app.use("/generation", generationRouter);
app.use("/account", accountRouter);

//error handler
//500 internal server error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: "error",
    message: err.message,
  });
});

engion.start();

module.exports = app;
