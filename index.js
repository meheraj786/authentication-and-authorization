const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const { authRouter } = require("./routers/authRouter");

const app = express();


app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;


mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB ERROR: " + err);
  });


app.use("/user", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
