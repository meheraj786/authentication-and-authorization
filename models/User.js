const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  confirmPassword: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate: {
      validator: function () {
        return this.password === this.confirmPassword;
      },
      message: "Passwords do not match",
    },
  },
});

UserSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    this.confirmPassword = undefined;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
