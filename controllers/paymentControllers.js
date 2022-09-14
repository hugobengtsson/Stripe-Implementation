import { stripe } from "../server.js";
import  fs  from 'fs';

const dataPath = './data/orders.json'

export const createPayment = async (req, res) => {
    
    if(req.session && req.session.loggedInUser) {
        
        // loop över cartItems som blir line_items.
        const session = await stripe.checkout.sessions.create({
            //fixa line items
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
        
    }else{
        res.status(401).json(false)
    }

}

export const verifyPayment = async (req, res) => {
    try {
        const findSession = await stripe.checkout.sessions.retrieve(req.body.sessionId)
        if(findSession.payment_status == "paid"){
            //pusha till order.json
            const lineItems = await getLineItems(req.body.sessionId)
            findSession.lineItems = lineItems.data
            
            let orders = fs.readFileSync(dataPath)
            orders = JSON.parse(orders)
            const findOrder = orders.find(order => order.id == findSession.id)
            
            if(!findOrder){
                orders.push(findSession)
                fs.writeFileSync(dataPath, JSON.stringify(orders))
                
            }
            res.status(200).json("Success")
            return 
        }
        res.status(404).json(false) //kolla statuskoden
        
    } catch (err) {
        res.status(404).json(err.message)
    }

}

export const getLineItems = async (sessionId) => {
   try {

    return await stripe.checkout.sessions.listLineItems(sessionId);

   } catch (error) {
    
   }
}