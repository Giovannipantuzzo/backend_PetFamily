const UserModel = require("../models/UserModel");
const Firebase = require("../utils/Firebase");

module.exports = {
  async create(request, response) {
    try {
      const user = request.body;
      let uid;

      try {
        uid = await Firebase.createNewUser(user.email, user.password);
      } catch (error) {
        return response.status(400).json(error);
      }

      delete user.password;
      user.firebase_id = uid;

      console.log(user);
      const result = await UserModel.create(user);

      return response.status(200).json({ user_id: result });
    } catch (error) {
      console.warn("User creation failed:", error);

      return response.status(500).json({
        notification: "Internal server error while trying to create User",
      });
    }
  },

  async profile(request, response) {
    try {
      const { user } = request.session;
      const result = await UserModel.getByFields({ user_id: user.user_id });
      return response.status(200).json(result);
    } catch (err) {
      console.log("User getById failed: " + err);
      return response.status(500).json({
        notification: "Internal server error while trying to get User",
      });
    }
  },

  async update(request, response) {
    try {
      const { user } = request.session;
      const newUser = request.body;
      await UserModel.updateById(newUser, user.user_id);
      return response
        .status(200)
        .json({ notification: "User updated sucesfully" });
    } catch (error) {
      console.warn("User update failed:", error);

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

  async forgot(request, response) {
    try {
      await Firebase.forgotPassword(request.body.email);
      return response.status(200).json({ message: "The email was sent." });
    } catch (err) {
      console.error(err.code);
      if (err.code === "auth/user-not-found") {
        return response.status(404).json({
          message: "This email is not registered",
        });
      }
      return response.status(500).json({
        notification: "Internal server error while trying to change data user",
      });
    }
  },
};
