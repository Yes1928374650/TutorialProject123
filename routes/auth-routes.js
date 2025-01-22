const express = require('express');
const {loginUser , registerUser,changePassword} = require('../controllers/auth-controller')
const router = express.Router();
const authMiddleWare = require('../middleware/auth-middleware')
//all routes are realted to autenticatchon & autchoristation
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password',authMiddleWare,changePassword);
//TODO: TODO => LEARN ABOUT THE SALTING METHODS!!! TODO:
module.exports= router;