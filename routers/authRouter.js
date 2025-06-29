const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.get("/users", authController.protect,  authController.getAllUser);

module.exports = { authRouter };
