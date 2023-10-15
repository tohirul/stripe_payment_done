const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const port = 5000;

app.get("/", function (req, res) {
  res.send("hello world");
});

app.post("/checkout", async (req, res) => {
  console.log("checkout called");
  console.log("Key:", process.env.STRIPE_API_SECRET_KEY);
  const items = req.body;
  console.log("Items: ", items);
  console.log(req.body);
  let lineItems = [];

  items.forEach((item) => {
    lineItems.push({
      price_data: {
        unit_amount: item.basePrice * 100,
        currency: "bdt",
        product_data: {
          name: item.name,
          // id: item.id,
        },
      },
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  console.log("Session: ", session);
  res.status(200).json({
    success: true,
    message: "Payment successful",
    success_url: session.url,
  });
});
app.listen(port, () => {
  console.log("listening on port " + port);
});

/* 

 let res = null;
  const checkoutPayment = async ({ lineItems }) => {
    let stripePromise = null;
    const getStripe = () => {
      if (!stripePromise)
        stripePromise = loadStripe(
          String(
            "pk_test_51JytSBSHoSHlDPtRoOd4x5uVOOnU9Czc7LHnkl6OLUw7GMm92FIxpfiHkfwfZcLrxI3AQ2rlidpE4eGErwUlWisn00ru4ZMsbV"
          )
        );
      return stripePromise;
    };
    const stripe = await getStripe();
    await stripe.redirectToCheckout({
      mode: "payment",
      lineItems,
      successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}`,
    });
  };

  const newCheckoutPayment = async ({ productName, price }) => {
    // console.log("Clicked From new Checkout");
    let stripePromise = null;
    const getStripe = () => {
      if (!stripePromise)
        stripePromise = loadStripe(
          String(
            "pk_test_51JytSBSHoSHlDPtRoOd4x5uVOOnU9Czc7LHnkl6OLUw7GMm92FIxpfiHkfwfZcLrxI3AQ2rlidpE4eGErwUlWisn00ru4ZMsbV"
          )
        );
      return stripePromise;
    };
    const stripe = await getStripe();
    const amount_to_charge = parseInt(400 / 2);
    console.log(
      await stripe.prices.create({
        unit_amount: amount_to_charge,
      })
    );

    await stripe.redirectToCheckout({
      mode: "payment",
      lineItems,
      successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}`,
    });
    ? Initiate Stripe instance connection
    const stripe = await loadStripe(
      "pk_test_51JytSBSHoSHlDPtRoOd4x5uVOOnU9Czc7LHnkl6OLUw7GMm92FIxpfiHkfwfZcLrxI3AQ2rlidpE4eGErwUlWisn00ru4ZMsbV"
    );

    // ? Create a new product on the stripe space dashboard
    const productResponse = await fetch("https://api.stripe.com/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${stripe._apiKey}`,
      },
      body: `name=${encodeURIComponent(productName)}`,
    });
    const product = await productResponse.json();
    console.log(product, "product");

    // ? Dynamically set a price for the product
    const priceResponse = await fetch("https://api.stripe.com/v1/prices", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${stripe._apiKey}`,
      },
      body: `product=${product.id}&currency=bdt&unit_amount=${price}`,
    });

    const stripePrice = await priceResponse.json();
    console.log(stripePrice, "stripePrice");

    ? Send data to the Stripe API on Redirect
    await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}`,
    });
  };

*/
