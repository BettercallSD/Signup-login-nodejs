import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import  jwt from "jsonwebtoken"
import dotenv from "dotenv";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("Connected to MongoDB");
})
.catch((err)=>{
  console.error("MongoDB connection error",err);
});


const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password:{
    type: String,
    required: true,
    minlength: 6

  },
  role:{
    type:String,
    default:"user"
  }
  });
export const User = mongoose.model("User", userSchema);
//routes
app.post("/signup",async (req,res)=>{
  try{
    const{email,password}=req.body;

    if(!email||!password){
      return res.status(400).json({
        error: "Email and password required"
      });
    }
    const existingUser= await User.findOne({email});

    if(existingUser){
      return res.status(400).json({
        error:"User already exists"
      })
    }
    const hashedPassword= await bcrypt.hash(password,10);

    const newUser= new User({
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully"
    })
  }
  catch(err){
    console.error("Signup eror",err);

    res.status(500).json({
      error: "Signup failed"
    });
  }
});

app.listen(PORT, () => {
  console.log("=== SERVER STARTED ===");
  console.log("http://localhost:3000");
  console.log("http://localhost:3000/signup");
  console.log("====================");
});