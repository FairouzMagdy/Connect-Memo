const MemoryRepository = require("../repos/memory.repo");

class MemoryService {
  async createMemory(memoryData, userId, files = {}) {
    return await MemoryRepository.createMemory(memoryData, userId, files);
  }

  async getUserMemories(userId, filterPublic = true) {
    return await MemoryRepository.getUserMemories(userId, filterPublic);
  }

  async getMemoryById(memoryId, userId) {
    return await MemoryRepository.getMemoryById(memoryId, userId);
  }

  async updateMemory(memoryId, userId, newData, files = {}) {
    return await MemoryRepository.updateMemory(
      memoryId,
      userId,
      newData,
      files
    );
  }

  async deleteMemory(memoryId, userId) {
    return await MemoryRepository.deleteMemory(memoryId, userId);
  }

  async shareMemoryWithUser(memoryId, currentUserId, userId) {
    return await MemoryRepository.shareMemoryWithUser(
      memoryId,
      currentUserId,
      userId
    );
  }

  async getAllMemories(userId) {
    return await MemoryRepository.getAllMemories(userId);
  }
}

module.exports = new MemoryService();
