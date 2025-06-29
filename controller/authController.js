const User = require("../models/user");
const jwt = require("jsonwebtoken");
const signUp = async (req, res) => {
  try {
    const user = new User({
      name: req.name,
      email: req.email,
      password: req.password,
      confirmPassword: req.confirmPassword,
    });
    const save = user.save();
    res.json({
      status: true,
      message: save,
    });
  } catch (error) {
    console.log(error);
  }
};

let signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      message: "email or password is incorrect",
    });
  }
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.json({
        message: "Email Does Not exist",
      });
    }
    const result = await user.comparePassword(password.user.password);
    if (!result) {
      return res.json({
        message: "Incorrect Password",
      });
    }
    const token= jwt.sign({id: user._id}, "This is a secret key", {expireIn: '1h'})
    return res.json({
      status: 'success',
      token
    })
  } catch (err) {
    return res.json({
      message: "Email Does Not exist",
    })
  }
};

const getAllUser= async(req, res)=>{
  try{
    const users= await User.find()
    res.json({
      status: true,
      users
    })

  }catch(error){
    res.json({
      message: error.message
    })

  }
}

const protect= async function(req,res,next){
  const token= req.headers.authorization;
  jwt.verify(token, "This is a secret key", async (err, data)=>{
    if (err){
      return res.json({
        status: failed,
        message: "Invalid Token, Log in Again"
      })
    }
    try{
      const user= await User.findById(data.id)
      if(!user){
        return res.json({
        status: "failed",
        message: "User not found"
      })
      }
      next()
    }catch(err){
      return res.json({
        status: "failed",
        message: "User not found"
      })
    }
    
  } )
}

module.exports = { signUp, signIn, getAllUser, protect };
