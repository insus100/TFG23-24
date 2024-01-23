import mongoose from "mongoose";
const { MONGODB_URI } = process.env;

if(!MONGODB_URI) {//si no está definido MONGODB_URI en .env.local
    throw new Error("MONGODB_URI must be defined!");
}
export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(MONGODB_URI);
        if(connection.readyState === 1) {
            console.log("MongoDB connected.");
            return Promise.resolve(true);
        }
    } catch(err) {
        console.log(err);
        return Promise.reject(false);
    }

}