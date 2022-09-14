import { stripe } from "../server.js";



export const createPayment = async (req, res) => {
    
    if(req.session && req.session.loggedInUser) {
        
        // loop över cartItems som blir line_items.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: 'price_1Lh8H9LiXPjWjAyxNUuDBP3v',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: "http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: `http://localhost:3000/cancel.html`,
            customer: req.session.loggedInUser.user.id 
        });
        
        res.json(session.id);
        
    }

}