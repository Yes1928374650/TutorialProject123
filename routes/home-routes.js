const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middleware/auth-middleware')

router.get('/homepage',authMiddleWare,(req,res)=>{
    const {username,userID,role} = req.userInfo;
    res.json({
        message: 'Welcome to the home page',
        user:{
            _id: userID,
            username,
            role,
        }
    })
});

module.exports = router