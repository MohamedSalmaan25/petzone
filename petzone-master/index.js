import express from "express";
import session from "express-session"; // Corrected the import for session
import bodyParser from "body-parser";
import homeRoute from "./Routes/homeRoute.js";
import loginRoute from "./Routes/loginRoute.js";
import productRoute from "./Routes/productRoute.js";
import cartRoute from "./Routes/cartRoute.js";
import registerRoute from "./Routes/registerRoute.js";
import profileRoute from "./Routes/profileRoute.js";
import paymentRoute from "./Routes/paymentRoute.js";
import {
  checkAdminAuthenticated,
  checkAuthenticated,
} from "./middleware/authmiddleware.js";
import adminloginRoute from "./Routes/adminLoginRoute.js";
import adminpanelRoute from "./Routes/adminpanelRoute.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production if using HTTPS
  })
);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use("/", adminloginRoute);

app.use("/", homeRoute);
app.use("/", loginRoute);
app.use("/", productRoute);
app.use("/", cartRoute);
app.use("/", registerRoute);
app.use("/", checkAdminAuthenticated, adminpanelRoute);
app.use("/", checkAuthenticated, profileRoute);
app.use("/", checkAuthenticated, paymentRoute);

app.use((req, res, next) => {
  res.status(404).render("404", { user: req.session.user || null });
  if (req.method === "POST") {
    console.log("Processing POST request:", req.path);
  }
  next();
});
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
