import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import  fs  from 'fs';
import { stripe } from '../server.js';

const dataPath = './data/users.json'

// Gets all users
export const getAllUsers = async (req, res) => {
    try {
        let users = fs.readFileSync(dataPath)

        res.status(200).json({bool: true, msg: JSON.parse(users)})
    }catch(err) {
        res.status(500).json({bool: false, msg: err.message})
    }
}

// Gets logged in user from cookie
export const getLoggedInUser = (req, res) => {
    if(req.session && req.session.loggedInUser) {
        res.status(200).json({bool: true, msg: req.session.loggedInUser})
        return
    }
    res.status(404).json({bool: false, msg: "Du är inte inloggad"})
}

// Login user
export const loginUser = async (req, res) => {
    try {
        // Gets list from json
        let users = fs.readFileSync(dataPath)
        users = JSON.parse(users)

        // Checks if input fields have value
        if(req.body && req.body.email.length > 0 && req.body.password.length > 0) { 
            
            // Checks existing email in stripe
            const checkExisitingUser = await stripe.customers.search({
                query: `email:\'${req.body.email}\'`,
            });

            if(checkExisitingUser.data.length == 0) {
                res.status(404).json({bool: false, msg: "Användaren finns inte i stripe, skapa ny användare"})
                return 
            }

            // Checks existing email in json-file
            const foundUser = users.find(user => user.email == req.body.email)

            if(foundUser && await bcrypt.compare(req.body.password, foundUser.password)) {
                req.session.loggedInUser = {
                    id: nanoid(),
                    user: foundUser,
                    date: new Date()
                }
                res.status(200).json({bool: true, msg: `Du är inloggad! Välkommen ${foundUser.name}!`})
                return
            }
            res.status(404).json({bool: false, msg: "Uppgifterna stämmer inte, försök igen"})
            return
        }
        res.status(404).json({bool: false, msg: "Du måste fylla i både användare och lösenord"})

    }catch(err) {
        res.status(404).json({bool: false, msg: err.message})
    }
}

// Register user
export const registerUser = async (req, res) => {
    try {
        // Gets list from json
        let users = fs.readFileSync(dataPath)
        users = JSON.parse(users)

        // Checks if all input fields have values
        if(
            req.body && 
            req.body.name.length > 0 && 
            req.body.password.length > 0 && 
            req.body.email.length > 0 && 
            req.body.address.length > 0 && 
            req.body.zipcode.length > 0 && 
            req.body.city.length > 0 && 
            req.body.country.length > 0 && 
            req.body.phone.length > 0 
        ) 
        {   
            // Check existing email in stripe
            const checkExisitingUser = await stripe.customers.search({
                query: `email:\'${req.body.email}\'`,
            });

            // Check existing email in json-file
            const findUserinList = users.find(user => user.email == req.body.email)

            if(!checkExisitingUser.data.length == 0 || findUserinList != undefined) {
                res.status(404).json({bool: false, msg: "Användaren existerar redan"})
                return 
            }

            // Encrypts the password
            const hashedPassword = await bcrypt.hash(req.body.password, 5)

            // Creates customer in stripe
            const customer = await stripe.customers.create({
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                address: {
                    line1: req.body.address,
                    postal_code: req.body.zipcode,
                    city: req.body.city,
                    country: req.body.country
                }
            });

            // Creates customer in json-file
            users.push({
                id: customer.id, 
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })

            // Replaces the old list from json with new updated one
            fs.writeFileSync(dataPath, JSON.stringify(users))

            res.status(200).json({bool: true, msg: "Ditt konto är skapat! Nu kan du logga in"})
            return
        }
        res.status(404).json({bool: false, msg: "Fyll i alla fält"})
    }catch(err) {
        res.status(404).json({bool: false, msg: err.message})
    }
}


// Log out user
export const logoutUser = (req, res) => {
    if(req.session && req.session.loggedInUser) {
        req.session.loggedInUser = null
        res.status(200).json({bool: true, msg: "Du är nu utloggad"})
    }
}
