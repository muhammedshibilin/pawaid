
import { MongoClient,ServerApiVersion } from "mongodb";
import mongoose from "mongoose";


const client = new MongoClient(process.env.MONGO_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


export async function connectToDb() {
  try {
    console.log('Connection string:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
}

