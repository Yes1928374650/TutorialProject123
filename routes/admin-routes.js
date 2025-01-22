const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middleware/auth-middleware')
const isAdminUser = require('../middleware/admin-middleware');
router.get('/welcome',authMiddleWare,isAdminUser,(req,res)=>{
    res.json({
        message:'Welcome to admin page'
    })
})
module.exports = router;