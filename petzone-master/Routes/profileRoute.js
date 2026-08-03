import express from "express";
import pool from "../DB/index.js"; // Make sure your database connection is imported

const router = express.Router();
router.get("/profile", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    // Fetch user details
    const userQuery = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.session.user.id,
    ]);
    const user = userQuery.rows[0];

    // Fetch order history for this user with status 'complete'
    const ordersQuery = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [req.session.user.id]
    );
    const orders = ordersQuery.rows;

    // Pass user and orders data to the template
    res.render("profile", { user, orders });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send("Server error");
  }
});

// Route to log out the user
router.post("/logout", (req, res) => {
  // Clear the session user
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

router.post("/cancelorder", async (req, res) => {
  const { id, email } = req.body;

  // Check if id or email is missing
  if (!id || !email) {
    return res.send(
      `<script>alert("Order ID and Email are required!"); window.history.back();</script>`
    );
  }

  try {
    // Check if the order ID already exists
    const existingOrder = await pool.query(
      "SELECT * FROM cancel_order WHERE id = $1",
      [id]
    );

    if (existingOrder.rows.length > 0) {
      return res.send(
        `<script>alert("Order cancellation already requested!"); window.history.back();</script>`
      );
    }

    // Insert new cancellation request
    await pool.query("INSERT INTO cancel_order (id, email) VALUES ($1, $2)", [
      id,
      email,
    ]);

    res.send(
      `<script>alert("Cancellation request submitted!"); window.location.href='/profile';</script>`
    );
  } catch (error) {
    console.error("Database error:", error);
    res.send(
      `<script>alert("Error submitting request!"); window.history.back();</script>`
    );
  }
});

export default router;
