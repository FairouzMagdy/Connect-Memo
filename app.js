const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

const app = express();

// middlewares
app.use(morgan("common"));
app.use(express.json());

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: false,
    preserveExtension: true,
  })
);

// controller registration
const controllersDirPath = path.join(__dirname, "controllers");
const controllersDirectory = fs.readdirSync(controllersDirPath);

for (const controllerFile of controllersDirectory) {
  const controller = require(path.join(controllersDirPath, controllerFile));
  app.use(controller);
}

module.exports = app;
