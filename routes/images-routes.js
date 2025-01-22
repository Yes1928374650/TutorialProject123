const express = require('express');
const authMiddleWare = require('../middleware/auth-middleware')
const isAdminUser = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageControler,fetchImagesControllers, deleteImageControler} = require("../controllers/image-controler");
const router = express.Router()
router.post('/upload',authMiddleWare,isAdminUser, uploadMiddleware.single('image'), uploadImageControler);
router.get('/get',authMiddleWare,fetchImagesControllers);
router.delete('/:id', authMiddleWare,isAdminUser,deleteImageControler);
module.exports = router