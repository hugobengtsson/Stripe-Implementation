import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import  fs  from 'fs';
import { stripe } from '../server.js';
import validateValues from '../validation/validation.js';

const dataPath = './data/users.json'

// Gets all users
export const getAllUsers = () => {
    try {
        let users = fs.readFileSync(dataPath)
        return {bool: true, msg: JSON.parse(users)}
    }catch(err) {
        return {bool: false, msg: err.message}
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
        let users = getAllUsers()
        if(!users.bool){
            return res.status(404).json({bool: false, msg: users.msg})
        }

        // Checks if input fields have value
        if(req.body && req.body.email.length > 0 && req.body.password.length > 0) { 
            
            // Checks existing email in stripe
            const checkExisitingUser = await stripe.customers.search({
                query: `email:\'${req.body.email}\'`,
            });

            if(checkExisitingUser.data.length == 0) {
                res.status(404).json({bool: false, msg: "Uppgifterna stämmer inte, försök igen"})
                return 
            }

            // Checks existing email in json-file
            const foundUser = users.msg.find(user => user.email == req.body.email)

            if(foundUser && await bcrypt.compare(req.body.password, foundUser.password)) {
                req.session.loggedInUser = {
                    id: nanoid(),
                    user: foundUser,
                    date: new Date()
                }
                res.status(200).json({bool: true, msg: foundUser.name})
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
        let users = getAllUsers()
        if(!users.bool){
            return res.status(404).json({bool: false, msg: users.msg})
        }
        
        // Checks if all input fields have values
        if(req.body) {   
            // Validates values
            const checkValues = validateValues(req.body)
            console.log(checkValues)
            if(!checkValues.bool) {
                res.status(404).json(checkValues)
                return
            }

            // Check existing email in stripe
            const checkExisitingUser = await stripe.customers.search({
                query: `email:\'${req.body.email}\'`,
            });

            // Check existing email in json-file
            const findUserinList = users.msg.find(user => user.email == req.body.email)

            if(!checkExisitingUser.data.length == 0 || findUserinList != undefined) {
                res.status(404).json({bool: false, msg: "Användaren existerar redan"})
                return 
            }

            // Encrypts the password
            const hashedPassword = await bcrypt.hash(req.body.password, 5)

            delete req.body.password

            // Creates customer in stripe
            const customer = await stripe.customers.create(req.body);

            // Creates customer in json-file
            users.msg.push({
                id: customer.id, 
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })

            // Replaces the old list from json with new updated one
            fs.writeFileSync(dataPath, JSON.stringify(users.msg))

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
