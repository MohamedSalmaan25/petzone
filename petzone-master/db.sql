CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price Numeric(10,2) NOT NULL,
    imageurl TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    img2 TEXT NOT NULL,
    img3 TEXT NOT NULL,
    img4 TEXT NOT NULL,
    sizes TEXT[] NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),  -- Store the reset token
    reset_token_expiration TIMESTAMP,  -- Store the expiration time for the reset token
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_name TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    order_date DATE NOT NULL,
    payment_status TEXT NOT NULL,
    razorpay_payment_id TEXT NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_signature TEXT NOT NULL,
    items JSONB NOT NULL -- Stores item details as JSON
);

ALTER TABLE orders
ADD COLUMN status VARCHAR(255) DEFAULT 'pending';

ALTER TABLE orders
ADD COLUMN delivery_status TEXT DEFAULT 'orderplaced';

ALTER TABLE orders ADD COLUMN estimated_delivery DATE DEFAULT NOW() + INTERVAL '7 days';


CREATE TABLE promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  price_offer NUMERIC(10, 2) NOT NULL
);


CREATE TABLE admin (
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
email VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(250) NOT NULL,
reset_token VARCHAR(250),
reset_token_expiration BIGINT

);

CREATE TABLE cancel_order(
id INTEGER NOT NULL,
email VARCHAR(200) NOT NULL
);
ALTER TABLE cancel_order
ADD COLUMN status TEXT DEFAULT 'incomplete';