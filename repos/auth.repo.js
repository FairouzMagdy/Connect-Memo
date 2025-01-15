const User = require("../models/user.model");

class AuthRepository {
  async signup(userData) {
    try {
      const { firstName, lastName, email, password, passwordConfirm } =
        userData;
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      });
      return newUser;
    } catch (error) {
      console.error(error);
    }
  }

  async login(userData) {
    try {
      const { email, password } = userData;
      if (!email || !password)
        throw new Error("Please provide email and password!");

      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.correctPassword(password, user.password)))
        throw new Error("Invalid username or password!");

      return user;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new AuthRepository();
