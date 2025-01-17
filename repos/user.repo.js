const User = require("../models/user.model");

class UserRepository {
  async getAllUsers() {
    try {
      const users = await User.find();
      if (!users) throw new Error("Users not found");
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) throw new Error("No user found with this id");
      return user;
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete({ _id: userId });
      if (!user) throw new Error("No user found with this id");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateMe(userId, newData) {
    try {
      if (newData.password || newData.passwordConfirm)
        throw new Error(
          "This route is not for updating passwords, please use /updateMyPassword"
        );

      const user = await User.findByIdAndUpdate({ _id: userId }, newData, {
        new: true,
        runValidators: true,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteMe(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { isActive: false }
      );
      if (!user) throw new Error("No user found with this id"); // 400
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
