const { mediaService } = require("../services/media.service");
const { imageKitPayloadBuilder } = require("../utils/media.util");

module.exports = (() => {
  const router = require("express").Router();

  router.post("/upload", async (req, res, next) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const uploadedFile = req.files.iti;
      const uploadPayload = [];

      if (Array.isArray(uploadedFile)) {
        for (const expressUploadedFile of uploadedFile) {
          const { fileName, src } = imageKitPayloadBuilder(expressUploadedFile);
          uploadPayload.push({
            src,
            fileName,
          });
        }
        const response = await mediaService.upload({
          files: uploadPayload,
        });
        res.json({
          message: response?.message || "uploaded!",
          filesIds: response.filesIds,
        });
      } else {
        // Get the original file name and extension
        const { fileName, src } = imageKitPayloadBuilder(uploadedFile);
        uploadPayload.push({
          src,
          fileName,
        });
        const response = await mediaService.upload({
          files: uploadPayload,
        });
        res.json({
          message: response?.message || "uploaded!",
          fileId: response.filesIds[0],
        });
      }
    } catch (exception) {
      console.log(exception);
    }
  });

  router.get("/download/:fileId", async (req, res, next) => {
    const fileId = req.params.fileId;
    if (!fileId) {
      return res.status(400).json({ message: "File id is required" });
    }

    const response = await mediaService.download(fileId);
    res
      .status(200)
      .json({ message: response.message, fileURL: response.url || "" });
  });

  return router;
})();
