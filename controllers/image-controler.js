const Image= require('../models/image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary')
const uploadImageControler = async(req,res)=>{
    try {
        //check if file is missing in a req object
        if(!req.file){
            return res.status(400).json({
                success: false,
                message : 'File is required. Please upload an image'
            })
        }
        //upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path);

        //store the image url and public id with the uploaded user id in the database
        const newImageUpload = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })
        await newImageUpload.save()

        //delete file from local storage
        fs.unlinkSync(req.file.path);
        res.status(201).json({
            succes: true,
            message: 'Image uploaded succesfuly',
            image: newImageUpload
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succes: false,
            message: '500, Somenthing went wrong'
        })
    }
}
const fetchImagesControllers = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1)*limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder = 'asc' ? 1: -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/ limit);
        const sortObj = {};
        sortObj[sortBy];
        //TODO: TODO !LEARN PAGING (ITS ABOUT PAGES) IN NODE AS YOU DON'T UNDERSTAND IT! TODO TODO:\\
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if(images){
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images,
            });
        }
    }catch(error){
        console.log(error);
                res.status(500).json({
        succes: false,
        message: '500, Somenthing went wrong'
    })}
}
const deleteImageControler= async(req,res)=>{
    try {
        const getCurrentImageIdtoDelete = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentImageIdtoDelete);
        console.log(image);
        if(!image){
            return res.status(404).json({
                success:false,
                message: 'Image not found'
            })
        }
            //check if t
        if(image.uploadedBy.toString()!== userId){
            return res.status(403).json({
                success:false,
                message:'You are not authorized to delete this image'
            })
        }
        //delete this image first from cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);
    //delete this image from mongoDB database
    await Image.findByIdAndDelete(getCurrentImageIdtoDelete);
    res.status(200).json({
        success:true,
        message:'Image deleted successfull'
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500, Somenthing went wrong'
    });
}
};
module.exports = {
    uploadImageControler,
    fetchImagesControllers,
    deleteImageControler
};