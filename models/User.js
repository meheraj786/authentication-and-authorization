const mongoose = require("mongoose");


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
      message: "Password Dosen't Match",
    },
  },
});

UserSchema.pre("save", async(next)=>{
  try {
    const hasedPassword= await bcrypt.hash(this.password, 10)
    this.password= hasedPassword;
    this.confirmPassword=hasedPassword;
    
  } catch (error) {
    console.log(error);
  }
  next()
})
UserSchema.methods.comparePassword= async function(userPassword, hashPassword){
  const result= await bcrypt.compare(userPassword, hashPassword)

  return result;
}

module.exports = mongoose.model("user", UserSchema);
