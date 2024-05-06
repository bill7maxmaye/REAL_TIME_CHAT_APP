const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const connection = mongoose.connection;
    //this will be called when connection is established
    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    connection.on("error", (error) => {
      console.log("MongoDB connection failed", error);
    });
  } catch (error) {
    console.log("something went wrong", error);
  }
}

module.exports = connectDB;
