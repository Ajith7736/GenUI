import mongoose from "mongoose";

async function connectdb() {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("Mongodb Connected Successfully")
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default connectdb;