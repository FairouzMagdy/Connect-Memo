class UserMiddleware {
  getMe(req, res, next) {
    req.params.userId = req.user.id;
    next();
  }
}

module.exports = new UserMiddleware();
