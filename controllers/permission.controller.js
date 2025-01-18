const express = require("express");
const {
  createPermission,
  getPermissions,
} = require("../services/permission.service");
const AuthMiddleware = require("../middlewares/auth.middleware");

class PermissionController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(AuthMiddleware.protect);

    this.router
      .route("/permissions")
      .get(AuthMiddleware.getPermissionsMiddleware, this.getPermissions)
      .post(AuthMiddleware.createPermissionMiddleware, this.createPermission);
  }

  async getPermissions(req, res, next) {
    try {
      const permissions = await getPermissions();
      res.status(200).json({
        message: "success",
        results: permissions.length,
        permissions,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async createPermission(req, res, next) {
    try {
      const newPermission = await createPermission(req.body);
      res.status(201).json({
        message: "success",
        newPermission,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }
}

module.exports = new PermissionController().router;
