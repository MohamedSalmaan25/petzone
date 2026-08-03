// let cart = [];
// let products = [];
// let totalPrice = document.getElementById("total_price");
// let cartCounter = document.getElementById("cart-counter");
// let cartItemsCount = document.getElementById("cart_counts");
// const cartTextElements = document.querySelectorAll(".cart_products");
// const btnControl = document.querySelector(".btn_control");
// const cartTotal = document.querySelector(".cart_total");

// loadCart();
// getData();
// checkCart();

// async function getData() {
//     let response = await fetch('json/products.json');
//     let json = await response.json();
//     products = json;
// }
// function loadCart() {
//     let storedCart = localStorage.getItem('cart');
//     if (storedCart) {
//         cart = JSON.parse(storedCart);
//     }
// }

// function saveCart() {
//     localStorage.setItem('cart', JSON.stringify(cart));
// }

// function addToCart(productId,inputQuantity = 1) {
//     let product = products.find(p => p.id == productId);
//     if (product) {
//         let existingProduct = cart.find(p => p.id == productId);
//         if (existingProduct) {
//             existingProduct.quantity += 1;
//         } else {
//             let productWithQuantity = { ...product, quantity: inputQuantity };
//             cart.push(productWithQuantity);
//         }
//         saveCart();
//         checkCart();
//     }
// }

// function addCartToHTML() {
//     let content = ``;
//     cart.forEach((product, index) => {
//         let price = parseFloat(product.price.replace('$', ''));
//         let totalPrice = price * product.quantity;
//         content += `
//         <div class="cart_product">
//             <div class="cart_product_img">
//                 <img src=${product.images[0]}>
//             </div>
//             <div class="cart_product_info">
//                 <div class="top_card">
//                     <div class="left_card">
//                         <h4 class="product_name">${product.name}</h4>
//                         <span class="product_price">${product.price}</span>
//                     </div>
//                     <div class="remove_product" onclick="removeFromCart(${index})">
//                         <ion-icon name="close-outline"></ion-icon>
//                     </div>
//                 </div>
//                 <div class="buttom_card">
//                     <div class="counts">
//                         <button class="counts_btns minus"  onclick="decreaseQuantity(${index})">-</button>
//                         <input type="number" inputmode="numeric" name="productCount" min="1" step="1" max="999"
//                             class="product_count"  value=${product.quantity}>
//                         <button  class="counts_btns plus" onclick="increaseQuantity(${index})">+</button>
//                     </div>
//                     <span class="total_price">$${totalPrice}.00</span>
//                 </div>
//             </div>
//         </div>`;
//     });
//     cartTextElements.forEach(element => {
//         element.innerHTML = content;
//     });;
// }

// function removeFromCart(index) {
//     cart.splice(index, 1);
//     saveCart();
//     checkCart();
// }
// function increaseQuantity(index){
//     cart[index].quantity += 1;
//     saveCart();
//     checkCart();
// }
// function decreaseQuantity(index) {
//     if (cart[index].quantity > 1) {
//         cart[index].quantity -= 1;
//         saveCart();
//         checkCart();
//     } else {
//         removeFromCart(index);
//     }
// }

// function updateTotalPrice() {
//     let total = cart.reduce((sum, product) => {
//         let price = parseFloat(product.price.replace('$', ''));
//         return sum + (price * product.quantity);
//     }, 0);
//     totalPrice.innerHTML = `$${total.toFixed(2)}`;
//     localStorage.setItem("total price" , total + 70);
//     return total;
// }

// // Initial call to display the cart products on page load
// function checkCart(){
//     if (cart.length == 0) {
//         cartTextElements.forEach(element => {
//             element.classList.add("empty");
//             element.innerHTML = "Your cart is empty";
//         })
//         cartCounter.innerHTML = 0;
//         btnControl.style.display = "none";
//         cartTotal.style.display = "none";
//         checkCartPage(0,0);
//     } else {
//         cartTextElements.forEach(element => {
//             element.classList.remove("empty");
//         })
//         addCartToHTML();
//         let totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
//         cartCounter.innerHTML = totalQuantity;
//         btnControl.style.display = "flex";
//         cartTotal.style.display = "flex";
//         let total = updateTotalPrice();
//         checkCartPage(total,totalQuantity);
//     }
// }
// // Add cart page not cart section
// function checkCartPage(total,totalQuantity){
//     if (window.location.pathname.includes("cartPage.html")) {
//         if (cart.length == 0) {
//             cartItemsCount.innerHTML = `(0 items)`;
//             document.getElementById("Subtotal").innerHTML = `$0.00`;
//             document.getElementById("total_order").innerHTML = `$0.00`;
//         }
//         else{
//             cartItemsCount.innerHTML = `(${totalQuantity} items)`;
//             displayInCartPage(total);
//         }
//     }
// }
// function displayInCartPage(total){
//     let subTotal = document.getElementById("Subtotal");
//     subTotal.innerHTML = `$${total.toFixed(2)}`;
//     let totalOrder= parseFloat(subTotal.innerHTML.replace('$', '')) + 70;
//     document.getElementById("total_order").innerHTML = `$${totalOrder.toFixed(2)}`;
// }
// function checkOut(){
//     let email = localStorage.getItem('email');
//     let password = localStorage.getItem('password');
//     if (cart.length != 0) {
//         if(email && password){
//           window.location.href = "checkout.html";
//         }
//         else {
//           window.location.href = "login.html";
//         }
//      }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const cartContainer = document.querySelector(".cart_products");
//   const totalPriceElement = document.getElementById("total_price");
//   const closeCartButton = document.querySelector(".closeCart");

//   // Retrieve cart from localStorage or initialize an empty cart
//   let cart = JSON.parse(localStorage.getItem("cart")) || [];

//   // Function to update cart UI
//   function updateCartUI() {
//     cartContainer.innerHTML = ""; // Clear cart display
//     let total = 0;

//     if (cart.length === 0) {
//       cartContainer.classList.add("empty");
//       cartContainer.innerHTML = "<p>Your cart is empty</p>";
//     } else {
//       cartContainer.classList.remove("empty");
//       cart.forEach((product, index) => {
//         total += product.price * product.quantity;
//         const cartItem = document.createElement("div");
//         cartItem.classList.add("cart_product");
//         cartItem.innerHTML = `
//           <div class="cart_product_img">
//             <img src="${product.image}" alt="${product.name}">
//           </div>
//           <div class="cart_product_info">
//             <div class="top_card">
//               <h4>${product.name}</h4>
//               <p class="product_price">$${product.price}</p>
//               <div class="remove_product" data-index="${index}">×</div>
//             </div>
//             <div class="buttom_card">
//               <div class="counts">
//                 <button class="counts_btns minus" data-index="${index}">-</button>
//                 <input type="text" class="product_count" value="${product.quantity}" readonly />
//                 <button class="counts_btns plus" data-index="${index}">+</button>
//               </div>
//             </div>
//           </div>
//         `;
//         cartContainer.appendChild(cartItem);
//       });
//     }

//     totalPriceElement.textContent = `$${total.toFixed(2)}`;
//   }

//   // Function to add product to cart
//   function addToCart(product) {
//     const existingProduct = cart.find((item) => item.id === product.id);
//     if (existingProduct) {
//       existingProduct.quantity += 1;
//     } else {
//       cart.push(product);
//     }

//     // Save updated cart to localStorage
//     localStorage.setItem("cart", JSON.stringify(cart));

//     updateCartUI();
//   }
//   // Attach event listeners dynamically to Add to Cart buttons
//   function attachCartListeners() {
//     document.querySelectorAll(".addToCart").forEach((button) => {
//       button.addEventListener("click", (event) => {
//         event.preventDefault();
//         const productCard = event.target.closest(".product-card");

//         if (!productCard) return;

//         const product = {
//           id: productCard.getAttribute("data-id"),
//           name: productCard.getAttribute("data-name"),
//           price: parseFloat(productCard.getAttribute("data-price")),
//           image: productCard.getAttribute("data-image"),
//           quantity: 1,
//         };

//         // Add the product to the cart
//         addToCart(product);

//         // Open the cart after adding the product
//         document.body.classList.add("showCart");
//       });
//     });
//   }

//   // Event listener for remove and quantity buttons inside the cart
//   cartContainer.addEventListener("click", (event) => {
//     if (event.target.classList.contains("remove_product")) {
//       const index = event.target.getAttribute("data-index");
//       cart.splice(index, 1); // Remove item from cart

//       // Save updated cart to localStorage
//       localStorage.setItem("cart", JSON.stringify(cart));

//       updateCartUI();
//     }

//     if (event.target.classList.contains("counts_btns")) {
//       const index = event.target.getAttribute("data-index");
//       const product = cart[index];

//       if (event.target.classList.contains("minus") && product.quantity > 1) {
//         product.quantity -= 1;
//       } else if (event.target.classList.contains("plus")) {
//         product.quantity += 1;
//       }

//       // Save updated cart to localStorage
//       localStorage.setItem("cart", JSON.stringify(cart));

//       updateCartUI();
//     }
//   });

//   // Close cart functionality
//   closeCartButton.addEventListener("click", () => {
//     document.body.classList.remove("showCart");
//   });

//   // Initialize cart UI based on stored cart
//   updateCartUI();

//   // Attach event listeners on page load
//   attachCartListeners();
// });
