const express = require("express");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Product Code Generation Logic
function hashString(str) {
  return [...str]
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16);
}

function findIncreasingSubstrings(name) {
  let substrings = [];
  let current = name[0];
  for (let i = 1; i < name.length; i++) {
    if (name[i].toLowerCase() > name[i - 1].toLowerCase()) {
      current += name[i];
    } else {
      if (current.length > 1) substrings.push(current);
      current = name[i];
    }
  }
  if (current.length > 1) substrings.push(current);
  return substrings;
}

function generateProductCode(name) {
  const substrings = findIncreasingSubstrings(name);
  const maxLength = Math.max(...substrings.map((s) => s.length));
  const longest = substrings.filter((s) => s.length === maxLength);
  const start = name.indexOf(longest[0]);
  const end = start + longest[0].length - 1;
  const hash = hashString(name);
  return `${hash}-${start}${longest.join("")}${end}`;
}

// database collection create
(async () => {
  try {
    await connectDB();
    const db = getDB();
    const products = db.collection("products");
    const categories = db.collection("categories");

    // Create  Product API

    app.post("/api/products", async (req, res) => {
      try {
        const {
          name,
          description,
          price,
          discount,
          image,
          status,
          categoryName,
        } = req.body;

        const categoryExists = await categories.findOne({
          name: { $regex: `^${categoryName}$`, $options: "i" },
        });
        if (!categoryExists) {
          return res.status(400).send({ error: "Category not found." });
        }

        const productCode = generateProductCode(name);

        const newProduct = {
          name,
          description,
          price,
          discount: discount || 0,
          image,
          status: status || "In Stock",
          categoryId:categoryExists._id,
          productCode,
        };

        const result = await products.insertOne(newProduct);
        res.send(result);
      } catch (err) {
        res.send({ error: err.message });
      }
    });

    // Create Category Api

    app.post("/api/categories", async (req, res) => {
      try {
        const { name } = req.body;

        const existing = await categories.findOne({ name });
        if (existing) {
          return res.send({ error: "Category already exists." });
        }

        const result = await categories.insertOne({ name });
        res.send(result);
      } catch (err) {
        res.send({ error: err.message });
      }
    });

    // Update Product use patch but you use put / patch is best

    app.patch("/api/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const productData = req.body;
        const filter = {
          _id: new ObjectId(id),
        };
        const updateDoc = {
          $set: productData,
        };
        const result = await products.updateOne(filter, updateDoc);
        res.send(result);
      } catch (err) {
        res.send({ error: err.message });
      }
    });

    // Get All Products and Filters the product use name and category id

    app.get("/api/products", async (req, res) => {
      try {
        const { category, name } = req.query;
        //all category if category=null
        const query = {};

        if (category) query.categoryId = new ObjectId(category);
        // find product name use no  letter sensitive
        if (name) query.name = { $regex: name, $options: "i" };

        const result = await products.find(query).toArray();

        const withPrices = result.map((p) => ({
          ...p,
          finalPrice: p.price - (p.price * p.discount) / 100,
        }));
        res.send(withPrices);
      } catch (err) {
        res.send({ error: err.message });
      }
    });

    // get All Categories

    app.get("/api/categories", async (req, res) => {
      try {
        const result = await categories.find().toArray();
        res.send(result);
      } catch (err) {
        res.send({ error: err.message });
      }
    });

    app.get("/", (req, res) => {
      res.send("the server is running");
    });
    app.listen(PORT, () => {
      console.log(`The Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
