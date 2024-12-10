import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config({path:'./src/.env'})

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); 
    }
};

export default connectToMongoDB;