const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");

const dbConnection = process.env.database;
const port = process.env.port || 3000;
mongoose
  .connect(dbConnection)
  .then(() => console.log("DB connection successful"))
  .catch((err) => {
    throw new Error("Error connecting to the database: " + err.message);
  });

app.listen(port, () => console.log(`Server listening on port ${port}`));
