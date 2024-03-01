import mongoose from 'mongoose';

const connectMongo = async () => {
    if (mongoose.connections[0].readyState) {
        return
    }
    return mongoose.connect(String(process.env.MONGODB_URI));
};

export default connectMongo;
