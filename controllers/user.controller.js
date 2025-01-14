const express = require("express");
const userService = require("../services/user.service");

class UserController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/users", this.getAllUsers);
    this.router.post("/users", this.createUser);
    this.router
      .route("/users/:userId")
      .get(this.getUser)
      .patch(this.updateUser)
      .delete(this.deleteUser);
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        message: "success",
        results: users.length,
        users,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUser(req.params.userId);
      res.status(200).json({
        message: "success",
        user,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async createUser(req, res, next) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({
        message: "success",
        newUser,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(
        req.params.userId,
        req.body
      );
      res.status(200).json({
        message: "success",
        updatedUser,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.userId);
      res.status(204).json({
        message: "success",
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController().router;
