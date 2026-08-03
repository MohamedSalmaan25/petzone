import express from "express";
import pool from "../DB/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products"); // Fetch products
    res.render("home", {
      products: result.rows,
      user: req.session.user || null,
    }); // Pass products to home.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

export default router;
