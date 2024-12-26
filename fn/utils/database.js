const mongoose = require("mongoose");
const log = require("./logger.js"); 


const connectodb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_URI);
        log.mongo("MongoDB is connected.");
    } catch (err) {
        log.error("Failed to connect to MongoDB. Ensure it is installed and running.");
        throw err; 
    }
};

module.exports = connectodb;
