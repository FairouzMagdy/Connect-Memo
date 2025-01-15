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
      throw error;
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
      throw error;
    }
  }

  async updatePassword(userId, userData) {
    try {
      const user = await User.findById(userId).select("+password");
      if (!user) throw new Error("User not found!");

      if (!userData.currentPassword)
        throw new Error("Current password must be provided!");

      if (
        !(await user.correctPassword(userData.currentPassword, user.password))
      )
        throw new Error("Current password is incorrect!");

      const isSamePassword = await user.correctPassword(
        userData.password,
        user.password
      );

      if (isSamePassword)
        throw new Error("Password must be different than current password!");

      user.password = userData.password;
      user.passwordConfirm = userData.passwordConfirm;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthRepository();
