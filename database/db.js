const mongoose = require('mongoose');

const conectToDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB conected successfully');
    }catch(e){
        console.log('MongoDB conection failed');
        process.exit(1) //TODO: LEARN MORE ABOUT THIS!!!
    }
};

module.exports = conectToDB;