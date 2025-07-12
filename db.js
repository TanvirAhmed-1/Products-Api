require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =  process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("productDB");
  } catch (err) {
    console.log(" MongoDB connection error:", err);
    throw err;
  }
}

function getDB() {
      // Ensures that the client will close when you finish/error
    // await client.close();
  if (!db) {
    throw new Error("DB not connected. Call connectDB() first.");
  }
  return db;
}


module.exports = {connectDB,getDB};
