import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import  fs  from 'fs';
import { stripe } from '../server.js';

const dataPath = './data/users.json'

// Gets all users
export const getAllUsers = async (req, res) => {
    try {
        let users = fs.readFileSync(dataPath)

        res.status(200).json(JSON.parse(users))
    }catch(err) {
        res.status(500).json(err.message)
    }
}

// Gets logged in user from cookie
export const getLoggedInUser = (req, res) => {
    if(req.session && req.session.loggedInUser) {
        res.status(200).json(req.session.loggedInUser)
        return
    }
    res.status(404).json("Du är inte inloggad")
}

// Login user
export const loginUser = async (req, res) => {
    try {
        let users = fs.readFileSync(dataPath)
        users = JSON.parse(users)

        if(req.body && req.body.email.length > 0 && req.body.password.length > 0) { 
            const foundUser = users.find(user => user.email == req.body.email)
    
            if(foundUser && await bcrypt.compare(req.body.password, foundUser.password)) {
                req.session.loggedInUser = {
                    id: nanoid(),
                    user: foundUser,
                    date: new Date()
                }
                res.status(200).json(`Du är inloggad! Välkommen ${foundUser.name}!`)
                return
            }
            res.status(404).json("Uppgifterna stämmer inte, försök igen")
            return
        }
        res.status(404).json("Du måste fylla i både användare och lösenord")

    }catch(err) {
        res.status(404).json(err.message)
    }
}

// Register user
export const registerUser = async (req, res) => {
    try {

        let users = fs.readFileSync(dataPath)
        users = JSON.parse(users)

        if(
            req.body && 
            req.body.name && 
            req.body.password && 
            req.body.email && 
            req.body.address && 
            req.body.zipcode && 
            req.body.city && 
            req.body.phone 
        ) 
        {   
            
            const checkExisitingUser = await stripe.customers.search({
                query: `email:\'${req.body.email}\'`,
            });

            if(checkExisitingUser.data.length > 0) {
                res.status(404).json("Användaren existerar redan")
                return
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 5)

            const customer = await stripe.customers.create({
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                address: {
                    line1: req.body.address,
                    postal_code: req.body.zipcode,
                    city: req.body.city
                }
            });

            users.push({
                id: customer.id, 
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })

            fs.writeFileSync(dataPath, JSON.stringify(users))
            res.status(200).json("Användaren är tillagd!")
            return
        }
        res.status(404).json("Fyll i alla fält")
    }catch(err) {
        res.status(404).json(err.message)
    }
}


// Log out user
export const logoutUser = (req, res) => {
    if(req.session && req.session.loggedInUser) {
        req.session.loggedInUser = null
        res.status(200).json("Du är nu utloggad")
    }
}
