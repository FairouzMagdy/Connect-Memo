const Memory = require("../models/memory.model");

class MemoryRepository {
  async createMemory(memoryData, userId) {
    try {
      const newMemory = await Memory.create({
        ...memoryData,
        createdBy: userId,
      });
      return newMemory;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getUserMemories(userId, filterPublic = true) {
    try {
      const query = { createdBy: userId };
      if (filterPublic) {
        query["privacy.zone"] = "public";
      }

      const memories = await Memory.find(query).populate("viewedBy");

      return memories;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getMemoryById(memoryId, userId) {
    try {
      const memory = await Memory.findOne({
        _id: memoryId,
        $or: [
          { "privacy.zone": "public" },
          { createdBy: userId },
          { "privacy.sharedWith": userId },
        ],
      }).populate("createdBy privacy.sharedWith viewedBy");

      if (!memory) throw new Error("No memory found with this id");

      if (
        !memory.createdBy.equals(userId) &&
        !memory.viewedBy.some((id) => id.equals(userId))
      ) {
        memory.viewedBy.push(userId);
        await memory.save();
      }

      if (!memory.createdBy.equals(userId)) {
        memory.viewedBy = undefined;
        memory.privacy.sharedWith = undefined;
      }

      return memory;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async updateMemory(memoryId, userId, newData) {
    try {
      const memory = await Memory.findOneAndUpdate(
        { _id: memoryId, createdBy: userId },
        newData,
        { new: true, runValidators: true }
      );
      if (!memory) throw new Error("No memory found with this id");
      return memory;
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteMemory(memoryId, userId) {
    try {
      const memory = await Memory.findOneAndDelete({
        _id: memoryId,
        createdBy: userId,
      });
      if (!memory) throw new Error("No memory found with this id");
      return memory;
    } catch (error) {
      console.error(error.message);
    }
  }

  async shareMemoryWithUser(memoryId, currentUserId, userId) {
    try {
      const memory = await Memory.findOneAndUpdate(
        { _id: memoryId, createdBy: currentUserId },
        { $addToSet: { "privacy.sharedWith": userId } },
        { new: true, runValidators: true }
      ).populate("privacy.sharedWith");

      if (!memory) throw new Error("No memory found with this id");
      return memory;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getAllMemories(userId) {
    // public and shared-with memories
    try {
      const memories = await Memory.find({
        $or: [{ "privacy.zone": "public" }, { "privacy.sharedWith": userId }],
      });
      return memories;
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = new MemoryRepository();
