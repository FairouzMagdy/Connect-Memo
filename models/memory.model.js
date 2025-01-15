const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ], // URLs or paths to stored images
    multimediaTracks: [
      {
        type: {
          type: String,
          enum: ["audio", "document", "other"],
          required: true,
        },
        path: {
          type: String,
          required: true,
        }, // File storage path
      },
    ],
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    emotions: [
      {
        type: String,
      },
    ], // e.g., 'happy', 'nostalgic', 'emotion codes'
    colorTheme: {
      type: String,
      default: "#ffffff",
    },
    privacy: {
      zone: {
        type: String,
        enum: ["private", "public"],
        default: "private",
      },
      sharedWith: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    viewedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MemorySchema.pre(/^find/, function () {
  this.populate({
    path: "viewedBy createdBy privacy.sharedWith",
    select: "firstName lastName profilePicture",
  });
});

const Memory = mongoose.model("Memory", MemorySchema);

module.exports = Memory;
