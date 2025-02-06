// import 'dotenv/config'
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { configDotenv } from 'dotenv';


configDotenv()
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error:",error);
        throw error;
    })
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running at Port:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDb connection failed:",err);
})


// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from 'express';


// const app = express();
// (async()=>{
//     try {
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error)=>{
//             console.log("Error:",error);
//             throw error;
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("ERROR : ",error);
//         throw error
//     }
// })()