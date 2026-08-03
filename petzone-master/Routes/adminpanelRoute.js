import express from "express";
import pool from "../DB/index.js";

const router = express.Router();

router.get("/shadowdriftadminpanel", (req, res) => {
  if (req.session.isAdminAuthenticated) {
    // Query to fetch users
    pool.query("SELECT * FROM users", (userError, userResult) => {
      if (userError) {
        console.error("Error fetching users: ", userError);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Query to fetch login attempts
      pool.query(
        "SELECT * FROM orders WHERE status=$1",
        ["approved"],
        (orderError, orderResult) => {
          if (orderError) {
            console.error("Error fetching login attempts: ", orderError);
            res.status(500).send("Internal Server Error");
            return;
          }

          // Query to fetch forms
          pool.query(
            "SELECT * FROM products",
            (productError, productResult) => {
              if (productError) {
                console.error("Error fetching forms: ", productError);
                res.status(500).send("Internal Server Error");
                return;
              }

              // Query to fetch admin logins
              pool.query(
                "SELECT * FROM promo_codes",
                (promo_codeError, promo_codeResult) => {
                  if (promo_codeError) {
                    console.error(
                      "Error fetching admin logins: ",
                      promo_codeError
                    );
                    res.status(500).send("Internal Server Error");
                    return;
                  }
                  pool.query(
                    "SELECT * FROM orders WHERE status=$1",
                    ["pending"],
                    (pendingorderError, pendingorderResult) => {
                      if (pendingorderError) {
                        console.error(
                          "Error fetching login attempts: ",
                          orderError
                        );
                        res.status(500).send("Internal Server Error");
                        return;
                      }

                      pool.query(
                        "SELECT * FROM cancel_order WHERE status=$1",
                        ["incomplete"],
                        (cancelorderError, cancelorderResult) => {
                          if (cancelorderError) {
                            console.error(
                              "Error fetching login attempts: ",
                              cancelorderError
                            );
                            res.status(500).send("Internal Server Error");
                            return;
                          }
                          // Query to fetch notes

                          // Render admin panel with users, login attempts, forms, admin logins, and notes
                          res.render("adminpanel", {
                            users: userResult.rows,
                            orders: orderResult.rows,
                            products: productResult.rows,
                            promo_codes: promo_codeResult.rows,
                            pendingorders: pendingorderResult.rows,
                            cancel_order: cancelorderResult.rows,
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } else {
    res.redirect("/shadowdriftadmin");
  }
});

router.post("/deleteuser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1", [userId]);

    res.redirect("/shadowdriftadminpanel");
  } catch (error) {
    console.log(error);
    res.send("db error");
  }
});

router.post("/addpromocode", async (req, res) => {
  const { code, price_offer } = req.body;
  const priceOfferNumber = parseFloat(price_offer);

  try {
    const result = await pool.query(
      "INSERT INTO promo_codes (code, price_offer) VALUES ($1,$2)",
      [code, priceOfferNumber]
    );

    res.redirect("/shadowdriftadminpanel");
  } catch (err) {
    console.log("error adding to db ", err);
  }
});

router.post("/deletepromo_code/:id", async (req, res) => {
  const Id = req.params.id;

  try {
    const result = await pool.query("DELETE FROM promo_codes WHERE id=$1", [
      Id,
    ]);

    if (result.rowCount > 0) {
      res.redirect("/shadowdriftadminpanel");
    } else {
      res.send("promo_code not found");
    }
  } catch (error) {
    res.send("DB error");
  }
});

router.post("/addproduct", async (req, res) => {
  const {
    name,
    price,
    imageurl,
    img2,
    img3,
    img4,
    category,
    description,
    sizes,
  } = req.body;

  console.log(req.body);
  try {
    const result = await pool.query(
      "INSERT INTO products (name,price,imageurl,img2,img3,img4,category,description,sizes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [name, price, imageurl, img2, img3, img4, category, description, sizes]
    );

    res.redirect("/shadowdriftadminpanel");
  } catch (error) {
    res.send("db error");
  }
});

router.post("/approveorder/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE orders SET status= $1 WHERE id=$2",
      ["approved", id]
    );

    res.send("data updated");
    // res.redirect('/shadowdriftadminpanel')
  } catch (error) {
    console.log(error);
  }
});

router.post("/cancelorder/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query("DELETE FROM orders WHERE id=$1", [id]);

    const query = await pool.query(
      "UPDATE cancel_order SET status = $1 WHERE id = $2",
      ["completed", id]
    );

    res.redirect("/shadowdriftadminpanel");
  } catch (error) {
    console.log(error);
  }
});

export default router;
