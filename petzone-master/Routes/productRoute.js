import express from "express";
import pool from "../DB/index.js"; // Assuming pool is correctly set up for PostgreSQL

const router = express.Router();

// Route to fetch all products
router.get("/product", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products"); // Fetch all products
    res.render("product", {
      products: result.rows,
      user: req.session.user || null,
    }); // Pass products to the product.ejs template
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Route to fetch individual product details
router.get("/product/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Query to fetch product details by product ID
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);

    // Check if product exists
    if (result.rows.length > 0) {
      const product = result.rows[0];

      // Initialize size options array
      let sizeOptions = [];

      // Check if sizes is present and parse it correctly
      if (product.sizes) {
        // Check if sizes is a JSON array or comma-separated string
        if (Array.isArray(product.sizes)) {
          sizeOptions = product.sizes; // Directly use it if it's an array
        } else if (typeof product.sizes === "string") {
          try {
            sizeOptions = JSON.parse(product.sizes); // If stored as a JSON string
          } catch (e) {
            sizeOptions = product.sizes.split(",").map((size) => size.trim()); // If stored as a comma-separated string
          }
        }
      }

      res.render("productDetails", {
        product,
        sizes: sizeOptions,
        user: req.session.user || null,
      }); // Pass product and sizes to the template
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching product details");
  }
});

export default router;
