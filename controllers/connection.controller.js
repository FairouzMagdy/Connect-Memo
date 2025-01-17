const ConnectionService = require("../services/connection.service");
const AuthMiddleware = require("../middlewares/auth.middleware");
const express = require("express");

class ConnectionController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(AuthMiddleware.protect);
    this.router
      .route("/connections")
      .get(this.getConnections)
      .post(this.sendConnection);

    this.router.patch(
      "/connections/accept/:connectionId",
      this.acceptConnection
    );

    this.router.delete(
      "/connections/cancel/:connectionId",
      this.cancelConnection
    );

    this.router.patch("/connections/block/:connectionId", this.blockConnection);
    this.router.patch(
      "/connections/unblock/:connectionId",
      this.unblockConnection
    );
  }

  async getConnections(req, res, next) {
    try {
      const connections = await ConnectionService.getConnections(
        req.user.id,
        req.query.status
      );

      if (!connections) res.status(404).send("No connections yet.");

      res.status(200).json({
        status: "success",
        results: connections.length,
        connections,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendConnection(req, res, next) {
    try {
      const newConnection = await ConnectionService.sendConnection(
        req.user.id,
        req.body.toUserId
      );

      if (!newConnection) {
        throw new Error("Failed to send connection");
      }

      res.status(201).json({
        status: "success",
        newConnection,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }

  async acceptConnection(req, res, next) {
    try {
      const connection = await ConnectionService.acceptConnection(
        req.params.connectionId,
        req.user.id
      );

      if (!connection) {
        throw new Error("Failed to accept connection");
      }

      res.status(200).json({
        status: "success",
        connection,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }

  async cancelConnection(req, res, next) {
    try {
      const connection = await ConnectionService.cancelConnection(
        req.params.connectionId
      );

      if (!connection) {
        throw new Error("Failed to cancel connection");
      }

      res.status(204).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }

  async blockConnection(req, res, next) {
    try {
      const connection = await ConnectionService.blockConnection(
        req.params.connectionId,
        req.user.id
      );

      if (!connection) {
        throw new Error("Failed to block connection");
      }

      res.status(204).json({
        status: "success",
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }

  async unblockConnection(req, res, next) {
    try {
      const connection = await ConnectionService.unblockConnection(
        req.params.connectionId,
        req.user.id
      );

      if (!connection) {
        throw new Error("Failed to unblock connection");
      }

      res.status(200).json({
        status: "success",
        connection,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }
}

module.exports = new ConnectionController().router;
