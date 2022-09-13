import { stripe } from "../server.js";

export const createPaymentIntent = async (req, res) => {

    console.log("hello")

    const { items } = req.body;

    const calculateOrderAmount = (items) => {
        // Replace this constant with a calculation of the order's amount
        // Calculate the order total on the server to prevent
        // people from directly manipulating the amount on the client
        return 1400;
    };

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sek",
    automatic_payment_methods: {
        enabled: true,
    },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}