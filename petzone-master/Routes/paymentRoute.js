import express from "express";
import Razorpay from "razorpay";
import bodyParser from "body-parser";
import { cart, calculateCartTotal } from "./cartRoute.js";
import pool from "../DB/index.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// ✅ Create Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID?.trim(), // remove invisible chars
  key_secret: process.env.RAZORPAY_KEY_SECRET?.trim(),
});

// ✅ Checkout Route - Create Order in Razorpay
router.post("/checkout", async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login");
  }
  const { total, subtotal, deliveryCharge } = calculateCartTotal(cart);

  if (cart.length === 0) {
    return res.send("Cart is empty. Add items before checkout.");
  }

  const checkoutItems = cart.map(({ id, name, quantity }) => ({
    id,
    name,
    quantity,
  }));

  // Store checkout items in the session
  req.session.checkoutItems = checkoutItems;
  console.log(typeof total);
  const options = {
    amount: total * 100, // Convert to paise
    currency: "INR",
    receipt: `order_rcpt_${Date.now()}`,
    payment_capture: 1,
  };
  console.log("Sending to Razorpay:", options);

  try {
    // Create an order in Razorpay
    const order = await razorpay.orders.create(options);

    // Render payment page with order details and pass order_id
    res.render("checkout", { order_id: order.id, amount: total });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    if (error.error) {
      console.error("Razorpay error details:", error.error); // Log specific error details from Razorpay
    }

    res.render("cart", {
      cart,
      total: total.toFixed(2),
      subtotal: subtotal.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      user: req.session.user || null,
      error: "Payment failed. Please try again after some time.",
    });
  }
});

// ✅ Payment Success Route
router.post("/payment-success", async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login");
  }

  // Destructure data from the POST body (checkout form submission)
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    full_name,
    address,
    city,
    pincode,
    phone,
  } = req.body;

  // Retrieve checkout items from the session
  const checkoutItems = req.session.checkoutItems || [];

  // Format checkoutItems to match the required format
  const formattedItems = checkoutItems.map(({ id, name, quantity }) => ({
    product_id: id,
    product_name: name,
    quantity: quantity,
  }));

  const user = req.session.user; // Get logged-in user details
  const orderDate = new Date().toISOString().split("T")[0]; // Current date
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // Add 7 days
  const estimatedDeliveryDate = estimatedDelivery.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  const paymentStatus = "Success"; // Mark payment as successful

  try {
    // Combine the billing address details from POST request
    const billingAddress = `${full_name}, ${address}, ${city}, ${pincode}, ${phone}`;

    // Convert the checkout items and customer details to JSON format
    const orderDetailsJson = JSON.stringify({
      items: formattedItems, // Store the formatted checkout items
    });

    // Insert order details into 'orders' table
    const orderQuery = `
      INSERT INTO orders (user_id, user_name, billing_address, order_date, payment_status, razorpay_payment_id, razorpay_order_id, razorpay_signature, items,estimated_delivery,status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,'pending') RETURNING id;
    `;
    const values = [
      user.id,
      user.name,
      billingAddress, // Store the complete billing address from POST request
      orderDate,
      paymentStatus,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderDetailsJson, // Store the JSON object with customer details and items
      estimatedDelivery,
    ];

    const orderResult = await pool.query(orderQuery, values);
    const orderId = orderResult.rows[0].id;

    // Clear cart after successful payment
    req.session.cart = [];

    // Render confirmation page with order details
    res.render("payment-success", {
      message: "Payment successful! Thank you for your order.",
      orderId: orderId,
      userName: user.name,
      billingAddress: billingAddress, // Display billing address in confirmation
      orderDate: orderDate,
      paymentStatus: paymentStatus,
      cartItems: formattedItems, // Pass formatted items to the UI if needed
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send("Error processing order. Please try again.");
  }
});

export default router;
