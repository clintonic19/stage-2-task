const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

let cachedConnectionPromise = null;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedConnectionPromise) {
    cachedConnectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`Database connected: ${conn.connection.name}`);

        conn.connection.on("error", (err) => {
          console.error("MongoDB connection error:", err);
        });

        return conn.connection;
      })
      .catch((error) => {
        cachedConnectionPromise = null;
        throw error;
      });
  }

  return cachedConnectionPromise;
};

module.exports = connectDB;
