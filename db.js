const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://jobAssignment:jKxbrKJmrgQJuCeR@cluster0.0p516.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("productDB");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

// Get DB instance after connection
function getDB() {
  if (!db) {
    throw new Error("DB not connected. Call connectDB() first.");
  }
  return db;
}

// ✅ Proper export of both functions
module.exports = {
  connectDB,
  getDB,
};
