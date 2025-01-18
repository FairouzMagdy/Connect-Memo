const permissionsModel = require("../models/permission.model");

module.exports.createPermission = async (permission) => {
  try {
    const newPermission = new permissionsModel(permission);
    await newPermission.save();
    return newPermission;
  } catch (error) {
    throw new Error("Error creating permission: " + error.message);
  }
};

module.exports.getPermissions = async () => {
  try {
    const permissions = await permissionsModel.find();
    return permissions;
  } catch (error) {
    throw new Error("Error fetching permissions: " + error.message);
  }
};

module.exports.getPermissionById = async (id) => {
  try {
    const permission = await permissionsModel.findById(id);
    if (!permission) {
      throw new Error("Permission not found");
    }
    return permission;
  } catch (error) {
    throw new Error("Error fetching permission: " + error.message);
  }
};

module.exports.updatePermission = async (id, updatedPermission) => {
  try {
    const permission = await permissionsModel.findByIdAndUpdate(
      id,
      updatedPermission,
      { new: true }
    );
    if (!permission) {
      throw new Error("Permission not found");
    }
    return permission;
  } catch (error) {
    throw new Error("Error updating permission: " + error.message);
  }
};

module.exports.deletePermission = async (id) => {
  try {
    const permission = await permissionsModel.findByIdAndDelete(id);
    if (!permission) {
      throw new Error("Permission not found");
    }
    return permission;
  } catch (error) {
    throw new Error("Error deleting permission: " + error.message);
  }
};

module.exports.getPermissionByResourceName = async (resource) => {
  try {
    const permission = await permissionsModel.findOne({
      resource: resource,
    });
    if (!permission) {
      throw new Error("Permission not found");
    }
    return permission;
  } catch (error) {
    throw new Error("Error fetching permission: " + error.message);
  }
};
