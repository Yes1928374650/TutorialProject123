require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/images-routes')
const app = express();
const PORT = process.env.PORT || 3000;
//middleware
app.use(express.json());
const conectToDB = require('./database/db');
conectToDB();

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image/', uploadImageRoutes);
app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
})
