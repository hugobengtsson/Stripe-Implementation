import { stripe } from "../server.js";


export const getOrders = async (req, res) => {

    try{

        if(req.session.loggedInUser.user.id) {
            const sessions = await stripe.checkout.sessions.list({
                customer: req.session.loggedInUser.user.id
            });

            let sessionLineItems = await Promise.all(sessions.data.map(async (session) => {
                    let lineItems = await stripe.checkout.sessions.listLineItems(session.id)
                    return new Promise((resolve, reject) => {
                        resolve({
                            session: session,
                            lineItems: lineItems.data
                        });
                    });

            }));

            const filteredSessions = sessionLineItems.filter(session => session.session.payment_status === "paid");
            res.json(filteredSessions);
            return;
        } 
        res.json(false)

    } catch(err) {
        res.status(404).json("Någonting gick fel");
    }
}