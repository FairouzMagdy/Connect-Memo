const User = require("../models/user.model");

class UserRepository {
  async getAllUsers() {
    try {
      const users = await User.find();
      if (!users) throw new Error("Users not found");
      return users;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch users");
    }
  }

  async getUser(userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) throw new Error("No user found with this id");
      return user;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch user");
    }
  }

  async createUser(userData) {
    try {
      const { firstName, lastName, email, password, role } = userData;
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
        passwordConfirm: password,
        role,
      });
      this.passwordConfirm = undefined;

      return newUser;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(userId, newData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        newData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) throw new Error("No user found with this id");

      return updatedUser;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to update user");
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete({ _id: userId });
      if (!user) throw new Error("No user found with this id");
      return user;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete user");
    }
  }
}

module.exports = new UserRepository();
