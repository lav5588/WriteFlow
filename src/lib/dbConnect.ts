import { DB_NAME } from "@/constant"
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    )
}
const connectionString = `${MONGODB_URI}/${DB_NAME}`;

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = {connection:null,promise:null}
}


async function dbConnect(){
    if(cached.connection){
        console.log('Using cached database connection');
        return cached.connection;
    } 
    if(!cached.promise){
        const opts = {
            bufferCommands:true,
            maxPoolSize:10
        }
        cached.promise = mongoose.connect(connectionString, opts).then(conn => {
            console.log('Connected to database successfully');
            return conn;
        });
    }
    try{
        cached.connection = await cached.promise;
    }
    catch(err) {
        cached.promise = null;
        throw err;
    }
}

export default dbConnect;