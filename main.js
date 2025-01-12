const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const { APP_CONFIG } = require("./config/app.config");
const { DATABASE } = require("./database/mongo/index");
const app = require("./app");

(async function () {
  await DATABASE.connectToMongo({
    dbOptions: {
      url: APP_CONFIG.MONGO_DEV_URI,
      databaseName: APP_CONFIG.MONGO_DATABASE_NAME,
      username: APP_CONFIG.MONGO_DATABASE_USER,
      password: APP_CONFIG.MONGO_DATABASE_PASSWORD,
    },
    callback: () => {
      console.log("App database has connected successfully");
      app.listen(APP_CONFIG.HTTP_PORT, "0.0.0.0", () => {
        console.log(`App is up and running on port ${APP_CONFIG.HTTP_PORT}`);
      });
    },
  });
})();
