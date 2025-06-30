const User = require("../models/user");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    const user = new User({
      name,
      email,
      password,
      confirmPassword,
    });

    const savedUser = await user.save();

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Email does not exist",
      });
    }

    const result = await user.comparePassword(password); 

    if (!result) {
      return res.status(401).json({
        status: "failed",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "This is a secret key",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong during login",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Token missing",
    });
  }

  jwt.verify(token, "This is a secret key", async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid token, login again",
      });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      req.user = user; 
      next();
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: "Server error",
      });
    }
  });
};

module.exports = {
  signUp,
  signIn,
  getAllUser,
  protect,
};
