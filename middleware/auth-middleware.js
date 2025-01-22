const jwt = require("jsonwebtoken");
//TODO: Learn if you need to have this [v LineBelow!]
const authMiddleWare = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success: false,
            message: '401 No token provided. Please Log in'
        });
    } 
    //decode the token
    try {
        const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(decodeTokenInfo)
        req.userInfo = decodeTokenInfo;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '500, server error'
        });
    }
};
module.exports = authMiddleWare