import mongoose from 'mongoose';

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from the environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Additional options can be added here if needed (e.g., useNewUrlParser, useUnifiedTopology)
        });

        // If the connection is successful, log the host of the connected database
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during the connection attempt, log the error message
        console.error(`Error: ${error.message}`);
        // Exit the process with a failure code (1) to indicate an error
        process.exit(1);
    }
};

// Export the connectDB function so it can be used in other parts of the application
export default connectDB;