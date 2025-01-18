const jwt = require("jsonwebtoken");
const { APP_CONFIG } = require("../config/app.config");
const { promisify } = require("util");
const UserRepository = require("../repos/user.repo");

const permissionModel = require("../models/permission.model");

class AuthMiddleware {
  async protect(req, res, next) {
    try {
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token)
        throw new Error("You are not logged in! Please login to get access"); // 401

      const decoded = await promisify(jwt.verify)(token, APP_CONFIG.JWT_SECRET);

      const currentUser = await UserRepository.getUser(decoded.id);
      if (!currentUser)
        throw new Error(
          "The user belonging to this token does not longer exist" // 401
        );

      req.user = currentUser;
      res.locals = currentUser;
      next();
    } catch (error) {
      res.status(400).json({ status: "fail", message: error.message });
    }
  }

  restrictTo(...roles) {
    return (req, res, next) => {
      try {
        if (!roles.includes(req.user.role))
          throw new Error("You do not have permission to perform this action"); // 403
        next();
      } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
      }
    };
  }

  async deleteUserPermissionMiddleware(req, res, next) {
    const userDeletePermission = await permissionModel.findOne({
      resource: "user",
      action: "delete",
      effect: "allow",
    });

    if (!userDeletePermission) {
      return res.status(403).json({
        message: "You don't have permission to delete a user",
      });
    }

    const claims = req.user;

    const isAuthorizedToDeleteUser =
      userDeletePermission.condition.role.IN.includes(claims.role);

    if (!isAuthorizedToDeleteUser) {
      return res.status(403).json({
        message: "You don't have permission to delete a user",
      });
    }

    next();
  }

  async createPermissionMiddleware(req, res, next) {
    try {
      const createPermission = await permissionModel.findOne({
        resource: "permission",
        action: "create",
        effect: "allow",
      });

      if (!createPermission) {
        return res.status(403).json({
          message: "You don't have permission to create a permission",
        });
      }

      const claims = req.user;

      const isAuthorizedToCreatePermission =
        createPermission.condition.role.IN.includes(claims.role);

      if (!isAuthorizedToCreatePermission) {
        return res.status(403).json({
          message: "You don't have permission to create a permission",
        });
      }

      next();
    } catch (error) {
      next(error); // Forward any unexpected errors to error-handling middleware
    }
  }

  async getPermissionsMiddleware(req, res, next) {
    try {
      const getPermission = await permissionModel.findOne({
        resource: "permission",
        action: "get",
        effect: "allow",
      });

      if (!getPermission) {
        return res.status(403).json({
          message: "You don't have permission to view permissions",
        });
      }

      const claims = req.user;

      const isAuthorizedToViewPermissions =
        getPermission.condition.role.IN.includes(claims.role);

      if (!isAuthorizedToViewPermissions) {
        return res.status(403).json({
          message: "You don't have permission to view permissions",
        });
      }

      next();
    } catch (error) {
      next(error); // Forward any unexpected errors to error-handling middleware
    }
  }
}

module.exports = new AuthMiddleware();
