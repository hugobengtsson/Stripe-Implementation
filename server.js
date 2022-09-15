import Express from "express"
import Stripe from "stripe"
import cookieSession from 'cookie-session'
import { router as userRouter } from './routes/userRouter.js'
import { router as productRouter } from './routes/productRouter.js'
import { router as paymentRouter } from './routes/paymentRouter.js'
import { secret } from './config/authConf.js'

const app = Express();
const port = 3000;
export const stripe = Stripe("sk_test_51Lh7v3LiXPjWjAyxmd5J6fqIYFjyHD44qg0nTBBMMZVZG6FumronOlLLgkTQ99QrPYnDChE73azp8ME4x4JN4fIN00Ju7m5O71")


app.use(Express.static("client"))
app.use(Express.json())
app.use(cookieSession({
    secret: secret,
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    sameSite: 'strict',
    httpOnly: true,
    secure: false
}))

app.use("/api", userRouter)
app.use("/api", productRouter)
app.use("/api/payment", paymentRouter)





app.listen(port, () => {
    console.log("Server is runnint on port: ", port)
})