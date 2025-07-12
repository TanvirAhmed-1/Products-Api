# 🛠️ Backend Development Challenge

This is a backend project built with **Node.js**, **Express**, and **MongoDB (Native Driver)** to manage products and categories. It includes features like product creation, category linking, auto-generated product codes, and filtering.

---
## learned TypeScript and Next.js, but since you’re more comfortable with JavaScript

## 🚀 Features

- ✅ Create Category (with duplicate check)
- ✅ Create Product (linked to a category by name)
- ✅ Auto-generate unique `productCode` from name
- ✅ Update Product info (`PATCH`)
- ✅ Filter Products by category and name
- ✅ Get Final Price after discount
- ✅ Native MongoDB driver (no Mongoose)

---

## 🔧 Technologies Used

- Node.js
- Express.js
- MongoDB Native Driver
- Dotenv

---

## 📁 Project Structure

project/
├── db.js # MongoDB connection
├── index.js # Main Express server with all routes
├── .env # Environment variables
└── README.md # You're reading this file!


### 📦 Category Routes

#### ➕ POST `/api/categories`
Create a new category  
**Body:**
```json
{
  "name": "Electronics"
}
📥 GET /api/categories
Get all categories


🛒 Product Routes
➕ POST /api/products
Create a product
Body:

{
  "name": "Alpha Sorter",
  "description": "A powerful sorting machine.",
  "price": 250,
  "discount": 10,
  "image": "https://example.com/product.jpg",
  "status": "In Stock",
  "categoryName": "Electronics"
}
 productCode will be auto-generated using longest increasing substrings + hash.

✏️ PATCH /api/products/:id
Update any product fields (like status, discount, etc.)
Body Example:

{
  "status": "Out of Stock",
  "discount": 20
}


🔍 GET /api/products
Filter products by category or name
Query Parameters:

category: MongoDB category ID

name: search keyword (case-insensitive)

Example:

/api/products?category=64b...abc&name=tv


 ## its so hard but i can the Product Code Logic

 $$$ Installation & Run

# Install dependencies
npm install

# Start server

nodemon index.js

