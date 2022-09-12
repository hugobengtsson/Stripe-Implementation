import { stripe } from "../server.js"

export const getAllProducts = async (req, res) => {

    const product = await stripe.products.list({
            expand: ['data.default_price']
        });

    res.json(product.data)
}