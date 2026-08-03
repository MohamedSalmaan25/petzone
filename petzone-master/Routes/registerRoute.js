import express from "express";
import bcrypt from "bcrypt";
import pool from "../DB/index.js";

const router = express.Router();

// Render the registration page
router.get("/register", (req, res) => {
  res.render("register", { user: req.session.user || null });
});

// Handle the registration form submission
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, confirmPassword } = req.body;

  try {
    // Check if the email is already registered
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.render("register", {
        errorMessage: "Email is already registered.",
        user: req.session.user || null,
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query(
      "INSERT INTO users (name, email, mobile, password) VALUES ($1, $2, $3, $4)",
      [name, email, mobile, hashedPassword]
    );

    // Redirect to the login page after successful registration
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.render("register", {
      errorMessage: "An error occurred. Please try again.",
      user: req.session.user || null,
    });
  }
});

export default router;
