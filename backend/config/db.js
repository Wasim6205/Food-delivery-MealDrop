import mongoose from "mongoose"

const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongodb connected")
    } catch (error) {
        console.log(`Db Error: ${error.message}`);
    }
}

export default connectDb