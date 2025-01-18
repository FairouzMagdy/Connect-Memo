const {
  createPermission,
  getPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
  getPermissionByResourceName,
} = require("../repos/permission.repo");

module.exports.createPermission = async (permission) => {
  return createPermission(permission);
};

module.exports.getPermissions = async () => {
  return getPermissions();
};

module.exports.getPermissionById = async (id) => {
  return getPermissionById(id);
};

module.exports.updatePermission = async (id, updatedPermission) => {
  return updatePermission(id, updatedPermission);
};

module.exports.deletePermission = async (id) => {
  return deletePermission(id);
};

module.exports.getPermissionByResourceName = async (resource) => {
  return getPermissionByResourceName(resource);
};
