import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
//script to connect to MongoDB
export const ConnectToDB= async()=>{
try{
    await mongoose.connect(process.env.DB_CONNECTION_STRING!);
    console.log("connection successful");
}catch(err){
    console.log(err);
}
    
}

//script to close the connection
export const CloseConnection=async()=>{
    try{
        await mongoose.connection.close();
        console.log("connection closed");
    }catch(err){
        console.log(err);
    }
}
