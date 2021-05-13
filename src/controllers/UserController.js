const { create } = require("../models/UserModel");
const UserModel = require("../models/UserModel");
const Firebase = require("../utils/Firebase");
const firebase = require("../utils/Firebase");

module.exports = {
  async create(request, response) {
    try {
      const user = request.body;

      const uid = await Firebase.createNewUser(
        user.name,
        user.email,
        user.password,
        user.number
      );

      delete user.password;
      user.firebase_id = uid;

      const result = await UserModel.create(user);
      return response.status(200).json({ user_id: result });
    } catch (error) {
      console.warn("User creation failed:", error);

      return response.status(500).json({
        notification: "Internal server error while trying to create User",
      });
    }
  },

  async getById(request, response) {
    try {
      const { user_id } = request.params;
      const result = await User.getById(user_id);

      return response.status(200).json(result);
    } catch (error) {
      console.log("User getById failed: " + err);
      return response.status(500).json({
        notification: "Internal server error while trying to get User",
      });
    }
  },

  async update(request, response) {
    try {
      const { user_id } = request.params;
      const newUser = request.body;

      await UserModel.updateById(user_id, newUser);

      return response
        .status(200)
        .json({ notification: "User updated sucesfully" });
    } catch (error) {
      console.warn("User creation failed:", error);

      return response.status(500).json({
        notification: "Internal server error while trying to update User",
      });
    }
  },

  async delete(request, response) {
    try {
      const { user_id } = request.params;

      const result = await UserModel.deleteById(user_id);

      if (result === 0)
        return response.status(400).json({ notification: "user_id not found" });

      return response
        .status(200)
        .json({ notification: "User deleted sucesfully" });
    } catch (error) {
      console.warn("User delete failed:", error);

      return response.status(500).json({
        notification: "Internal server error while trying to delete User",
      });
    }
  },
};
