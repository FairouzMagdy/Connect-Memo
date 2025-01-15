const jwt = require("jsonwebtoken");
const { APP_CONFIG } = require("../config/app.config");
const { promisify } = require("util");
const UserRepository = require("../repos/user.repo");

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
      console.error(error);
    }
  }

  restrictTo(...roles) {
    return (req, res, next) => {
      try {
        if (!roles.includes(req.user.role))
          throw new Error("You do not have permission to perform this action"); // 403
        next();
      } catch (error) {
        console.error(error);
      }
    };
  }
}

module.exports = new AuthMiddleware();
