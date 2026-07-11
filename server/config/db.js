const mongoose = require("mongoose");
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB:", process.env.MONGO_URI);
}).catch((err)=>{
    console.log("MongoDB connection error:", err);
})