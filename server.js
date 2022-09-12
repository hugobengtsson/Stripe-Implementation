import Express from "express"
import Stripe from "stripe"


const app = Express();
const port = 3000;
const stripe = Stripe("sk_test_51Lh7v3LiXPjWjAyxmd5J6fqIYFjyHD44qg0nTBBMMZVZG6FumronOlLLgkTQ99QrPYnDChE73azp8ME4x4JN4fIN00Ju7m5O71")


app.use(Express.static("client"))
app.use(Express.json())

app.get("/getproducts", async (req, res) => {

    const product = await stripe.products.list({
            expand: ['data.default_price']
        });

    res.json(product.data)

})



app.listen(port, () => {
    console.log("Server is runnint on port: ", port)
})