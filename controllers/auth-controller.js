//TODO: ANALIZE AND LEARN WHAT YOU DONT UNDERSTAND HERE vvvvvvvvvvvvvvvvvvvvvvv !!!!!! :TODO\\
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const env = require('dotenv');
//register contoler
function responseMessage(res,resMessage,statusCode, succes){
    return res.status(statusCode).json({
        success: succes,
        message: resMessage,
    });
}
const registerUser = async(req,res)=>{
    try {
        //extract user info from request body
        const {username, email, password, role} = req.body;
        //check if the user exists
        const checkExistingUser = await User.findOne({$or : [{username},{email}]});
        if(checkExistingUser){
            return responseMessage(res,'400 User with the same email/username exist.Please provide difrent username or mail',400,false)}
        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        //create a new user and save in your database
        console.log(password)
        console.log(hashedPassword)
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role : role || 'user'
        })
        await newlyCreatedUser.save()
        if(newlyCreatedUser){
            return responseMessage(res,"User registered succesfully",201,true)            
        }else{
            return responseMessage(res,'400 unable to register user, please try again',400,false)            
        }
    } catch (e) {
        console.log(e);
        return responseMessage(res,"500, an error accured",500,false)            
    }
}

//login controler

const loginUser = async(req,res)=>{
    try {
        const{username,password} = req.body;
        //find if the user exists
        const user = await User.findOne({username});
        if(!user){
            return responseMessage(res,'400, user doesnt exist',400,false)                
        }
        //create user token
        const accesToken = jwt.sign({
            userId : user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY,{
            expiresIn: '5m'
        })
        //if the password is corect or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return responseMessage(res,'400, Invalid password',400,false)                
        }
        res.status(200).json({
            success:true,
            message: "Loged in succesful",
            accesToken
        })
        
    } catch (e) {
        console.log(e);
        return responseMessage(res,'500, an error accured',500,false)                
    }
};
const changePassword = async(req,res)=>{
    try{
      const userId = req.userInfo.userId;
      //extract old and new password;
      const {oldPassword, newPassword} = req.body;

      //find the current logged in user
      const user = await User.findById(userId);
      if(!user){
        res.status(400).json({
            success: false,
        message: '400, User not found'
          })
      }
      //check if the old password is correct
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

      if(!isPasswordMatch){
        return res.status(400).json({
            success:false,message:'400 Old password incorect! Please try again!'});
      }
      //hash the new password
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
      //update password
      user.password = newHashedPassword
      await user.save()
      res.status(200).json({
        success:true,
        message:'Password changed succesfuly'
      })
    }catch(e){
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Somenthing went wrong'
      })
    }
}
module.exports ={loginUser , registerUser,changePassword};