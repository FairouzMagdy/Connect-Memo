const MemoryService = require("../services/memory.service");
const AuthMiddleware = require("../middlewares/auth.middleware");
const express = require("express");

class MemoryController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(AuthMiddleware.protect);
    this.router
      .route("/memories")
      .get(this.getAllMemories)
      .post(this.createMemory);

    this.router.get("/memories/my", this.getMyMemories);

    this.router
      .route("/memories/:memoryId")
      .get(this.getMemoryById)
      .patch(this.updateMemory)
      .delete(this.deleteMemory);

    this.router.patch(
      "/memories/:memoryId/share/:userId",

      this.shareMemoryWithUser
    );
    this.router.get("/memories/user/:userId", this.getUserMemories);
  }

  async getUserMemories(req, res, next) {
    try {
      const memories = await MemoryService.getUserMemories(req.params.userId);

      res.status(200).json({
        message: "success",
        results: memories.length,
        memories,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async getMyMemories(req, res, next) {
    try {
      const memories = await MemoryService.getUserMemories(req.user.id, false);
      res.status(200).json({
        message: "success",
        results: memories.length,
        memories,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async getAllMemories(req, res, next) {
    try {
      const memories = await MemoryService.getAllMemories(req.user.id);

      res.status(200).json({
        message: "success",
        results: memories.length,
        memories,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async getMemoryById(req, res, next) {
    try {
      const memory = await MemoryService.getMemoryById(
        req.params.memoryId,
        req.user.id
      );

      if (!memory) throw new Error("No memory found with this id"); // 400 bad request

      res.status(200).json({
        message: "success",
        memory,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async createMemory(req, res, next) {
    try {
      const files = {
        images: req.files?.images || [],
        multimedia: req.files?.multimedia || [],
      };

      const newMemory = await MemoryService.createMemory(
        req.body,
        req.user.id,
        files
      );

      res.status(201).json({
        message: "success",
        newMemory,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async updateMemory(req, res, next) {
    try {
      const files = {
        images: req.files?.images || [],
        multimedia: req.files?.multimedia || [],
      };

      const memory = await MemoryService.updateMemory(
        req.params.memoryId,
        req.user.id,
        req.body,
        files
      );
      if (!memory) throw new Error("No memory found with this id");

      res.status(200).json({
        message: "success",
        memory,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }

  async deleteMemory(req, res, next) {
    try {
      const memory = await MemoryService.deleteMemory(
        req.params.memoryId,
        req.user.id
      );
      if (!memory) throw new Error("No memory found with this id");

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

  async shareMemoryWithUser(req, res, next) {
    try {
      const { memoryId, userId } = req.params;
      const memory = await MemoryService.shareMemoryWithUser(
        memoryId,
        req.user.id,
        userId
      );
      if (!memory) throw new Error("No memory found with this id");

      res.status(200).json({
        message: "success",
        memory,
      });
    } catch (error) {
      res.status(400).json({
        message: "fail",
        error: error.message,
      });
    }
  }
}

module.exports = new MemoryController().router;
