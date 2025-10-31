import mongoose from "mongoose";
import { config } from "../config/index.js";

export async function conectMongo(){

    if(!config.mongoUri){
        throw new Error('MONGO URI was not defined in .env file');

    }
    await mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri);
    console.log('Conected to ATLAS DB');
}