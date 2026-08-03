import express from "express";
import pool from "../DB/index.js";

const router = express.Router();

let cart = []; // Stores the cart items

// Function to calculate subtotal and total
export const calculateCartTotal = (cart, discount = 0) => {
  let subtotal = 0;

  // Calculate the subtotal by summing the price * quantity of each item
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const deliveryCharge = 1.0; // Fixed delivery charge
  const total = subtotal + deliveryCharge - discount; // Subtract the discount from the total

  return { subtotal, total, deliveryCharge };
};

// Route to display the cart page
router.get("/cart", (req, res) => {
  const { subtotal, total, deliveryCharge } = calculateCartTotal(cart);

  // Render the cart page and pass the updated cart data
  res.render("cart", {
    cart,
    subtotal: subtotal.toFixed(2),
    deliveryCharge: deliveryCharge.toFixed(2),
    total: total.toFixed(2), // Display the final total
    user: req.session.user || null,
    error: "",
  });
});

// Route to add item to the cart
router.post("/add-to-cart", (req, res) => {
  const { id, name, price, size, imgSrc } = req.body;
  console.log(req.body);

  // Check if the item already exists in the cart with the same size
  let existingItem = cart.find((item) => item.id === id && item.size === size);

  if (existingItem) {
    existingItem.quantity += 1; // If item exists with the same size, increment the quantity
  } else {
    // If item doesn't exist or the size is different, add new item with quantity set to 1
    cart.push({ id, name, price, imgSrc, size, quantity: 1 });
  }

  // Calculate the new subtotal and total after adding the item
  const { subtotal, total, deliveryCharge } = calculateCartTotal(cart);

  // Redirect to the cart page with updated items
  res.render("cart", {
    cart,
    subtotal: subtotal.toFixed(2),
    deliveryCharge: deliveryCharge.toFixed(2),
    total: total.toFixed(2), // Display the final total
    user: req.session.user || null,
    error: "",
  });
});

router.post("/promo-code", async (req, res) => {
  const { code } = req.body; // Get the promo code from the request

  try {
    // Query the database to check if the promo code exists
    const promoQuery = await pool.query(
      "SELECT * FROM promo_codes WHERE code = $1",
      [code]
    );

    if (promoQuery.rows.length > 0) {
      // Promo code is valid, get the discount amount
      const discount = promoQuery.rows[0].price_offer;

      // Recalculate the total with the discount applied
      const { subtotal, total, deliveryCharge } = calculateCartTotal(
        cart,
        discount
      );

      // Send the response with the discount applied
      res.render("cart", {
        cart,
        subtotal: subtotal.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        total: total.toFixed(2),
        user: req.session.user || null,
        successMessage: `Promo code applied! You get ₹${discount} off.`,
        error: "",
      });
    } else {
      // Invalid promo code
      const { subtotal, total, deliveryCharge } = calculateCartTotal(cart);
      res.render("cart", {
        cart,
        subtotal: subtotal.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        total: total.toFixed(2),
        user: req.session.user || null,
        errorMessage: "Invalid promo code. Please try again.",
        error: " ",
      });
    }
  } catch (err) {
    console.error("Error applying promo code:", err);
    res.status(500).send("Server error");
  }
});

// Route to update item quantity
router.post("/update-quantity", (req, res) => {
  const { id } = req.body;
  const action = req.body.action;

  let item = cart.find((item) => item.id === id);

  if (item) {
    if (action === "increase") {
      item.quantity += 1; // Increase the quantity
    } else if (action === "decrease" && item.quantity > 1) {
      item.quantity -= 1; // Decrease the quantity, but prevent going below 1
    }
  }

  // Recalculate subtotal and total after updating the quantity
  const { subtotal, total, deliveryCharge } = calculateCartTotal(cart);

  // Redirect to the cart page with updated quantity and total
  res.render("cart", {
    cart,
    subtotal: subtotal.toFixed(2),
    deliveryCharge: deliveryCharge.toFixed(2),
    total: total.toFixed(2),
    user: req.session.user || null,
    error: "",
  });
});

// Route to remove item from the cart
router.post("/remove-from-cart", (req, res) => {
  const { id } = req.body;

  // Remove the item from the cart based on the ID
  cart = cart.filter((item) => item.id !== id);

  // Recalculate subtotal and total after removing the item
  const { subtotal, total, deliveryCharge } = calculateCartTotal(cart);

  // Redirect to the cart page after removing the item
  res.render("cart", {
    cart,
    subtotal: subtotal.toFixed(2),
    deliveryCharge: deliveryCharge.toFixed(2),
    total: total.toFixed(2),
    user: req.session.user || null,
    error: "",
  });
});

export { cart };
export default router;
