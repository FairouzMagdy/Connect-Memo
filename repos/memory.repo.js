const Memory = require("../models/memory.model");
const { mediaService } = require("../services/media.service");
const { imageKitPayloadBuilder } = require("../utils/media.util");

class MemoryRepository {
  async createMemory(memoryData, userId, files = {}) {
    try {
      if (files.images) {
        const imageFiles = Array.isArray(files.images)
          ? files.images
          : [files.images];

        const imageUploadPayload = imageFiles.map((file) =>
          imageKitPayloadBuilder(file)
        );

        const imageUploadResponse = await mediaService.upload({
          files: imageUploadPayload,
        });

        if (imageUploadResponse.message === "success") {
          memoryData.images = imageUploadResponse.filesIds;
        } else {
          throw new Error("Failed to upload images");
        }
      }

      if (files.multimedia) {
        const multimediaFiles = Array.isArray(files.multimedia)
          ? files.multimedia
          : [files.multimedia];

        const multimediaUploadPayload = multimediaFiles.map((file) => {
          const fileType = file.mimetype.split("/")[0];
          return imageKitPayloadBuilder(file, fileType);
        });

        const multimediaUploadResponse = await mediaService.upload({
          files: multimediaUploadPayload,
        });

        if (multimediaUploadResponse.message === "success") {
          memoryData.multimediaTracks = multimediaUploadResponse.filesIds.map(
            (fileId, index) => ({
              type: multimediaUploadPayload[index].type,
              path: fileId,
            })
          );
        } else {
          throw new Error("Failed to upload multimedia files");
        }
      }
      const newMemory = await Memory.create({
        ...memoryData,
        createdBy: userId,
      });

      return newMemory;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  async updateMemory(memoryId, userId, newData, files = {}) {
    try {
      const memory = await Memory.findOne({ _id: memoryId, createdBy: userId });
      if (!memory) throw new Error("No memory found with this id");

      if (files.images) {
        const imageFiles = Array.isArray(files.images)
          ? files.images
          : [files.images];

        const imageUploadPayload = imageFiles.map((file) =>
          imageKitPayloadBuilder(file)
        );

        const imageUploadResponse = await mediaService.upload({
          files: imageUploadPayload,
        });

        if (imageUploadResponse.message === "success") {
          newData.images = imageUploadResponse.filesIds;
        } else {
          throw new Error("Failed to upload images");
        }
      }

      if (files.multimedia) {
        const multimediaFiles = Array.isArray(files.multimedia)
          ? files.multimedia
          : [files.multimedia];

        const multimediaUploadPayload = multimediaFiles.map((file) => {
          const fileType = file.mimetype.split("/")[0];
          return imageKitPayloadBuilder(file, fileType);
        });

        const multimediaUploadResponse = await mediaService.upload({
          files: multimediaUploadPayload,
        });

        if (multimediaUploadResponse.message === "success") {
          newData.multimediaTracks = multimediaUploadResponse.filesIds.map(
            (fileId, index) => ({
              type: multimediaUploadPayload[index].type,
              path: fileId,
            })
          );
        } else {
          throw new Error("Failed to upload multimedia files");
        }
      }

      const updatedMemory = await Memory.findOneAndUpdate(
        { _id: memoryId, createdBy: userId },
        newData,
        { new: true, runValidators: true }
      );

      return updatedMemory;
    } catch (error) {
      throw error;
    }
  }

  async deleteMemory(memoryId, userId) {
    try {
      const memory = await Memory.findOne({
        _id: memoryId,
        createdBy: userId,
      });

      if (!memory) {
        throw new Error("Memory not found");
      }

      const mediaFileIds = [
        ...memory.images,
        ...memory.multimediaTracks.map((track) => track.path),
      ];

      for (const fileId of mediaFileIds) {
        try {
          const deleteResponse = await mediaService.deleteFile(fileId);

          if (deleteResponse.message !== "success") {
            console.error(`Failed to delete file ${fileId}`);
          }
        } catch (error) {
          console.error(`Error deleting file ${fileId}:`, error);
        }
      }

      return await Memory.findOneAndDelete({
        _id: memoryId,
        createdBy: userId,
      });
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}

module.exports = new MemoryRepository();
