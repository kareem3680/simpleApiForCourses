const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "field is required validate E-mail"]
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  role: {
    type: String,
    enum: ["User", "Admin", "Manager"],
    default: "User"
  },
  avatar: {
    type: String,
    default: "Uploads/profile.png"
  }
});

module.exports = mongoose.model("User", userSchema);
