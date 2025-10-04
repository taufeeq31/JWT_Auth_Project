import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log(`Mongo URI: ${process.env.MONGO_URI}`);

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);

    } catch (err) {
        console.log(`Error in connect to MongoDB : ${err.message}`);
        process.exit(1); // 1 means failure and 0 means success

    }
}
