const jwt = require("jsonwebtoken");
const { APP_CONFIG } = require("../config/app.config");
const express = require("express");
const authService = require("../services/auth.service");

class AuthController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();

    this.createSendToken = this.createSendToken.bind(this);
  }
  initializeRoutes() {
    this.router.post("/login", this.login.bind(this));
    this.router.post("/signup", this.signup.bind(this));
  }

  async signup(req, res, next) {
    try {
      const newUser = await authService.signup(req.body);
      this.createSendToken(newUser, 201, res);
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  }

  async login(req, res, next) {
    try {
      const user = await authService.login(req.body);
      if (!user) throw new Error("Invalid login");
      this.createSendToken(user, 200, res);
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  }
  signToken(id, role) {
    return jwt.sign({ id, role }, APP_CONFIG.JWT_SECRET, {
      expiresIn: APP_CONFIG.JWT_EXPIRES_IN,
    });
  }

  createSendToken(user, statusCode, res) {
    const token = this.signToken(user._id, user.role);
    user.password = undefined;

    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  }
}

module.exports = new AuthController().router;
