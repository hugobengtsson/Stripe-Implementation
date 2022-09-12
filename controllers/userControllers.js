import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import  fs  from 'fs';

const dataPath = './data/users.json'

// Gets all users
export const getAllUsers = (req, res) => {
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

        if(req.body && req.body.username.length > 0 && req.body.password.length > 0) { 
            const foundUser = users.find(user => user.username == req.body.username)
    
            if(foundUser && bcrypt.compare(req.body.password, foundUser.password)) {
                req.session.loggedInUser = {
                    id: nanoid(),
                    user: foundUser,
                    date: new Date()
                }
                res.status(200).json("Du är inloggad!")
                return
            }
            // res.status(401).json("Fel lösenord") För osäkert? 
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

        if(req.body && req.body.username && req.body.password) {   
            const checkExisitingUser = users.find(user => user.username == req.body.username)
    
            if(checkExisitingUser) {
                res.status(404).json("Användarnamnet existerar redan")
                return
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 5)
    
            users.push({
                id: nanoid(),
                username: req.body.username,
                password: hashedPassword
            })

            fs.writeFileSync(dataPath, JSON.stringify(users))
            res.status(200).json("Användaren är tillagd!")
            return
        }
        res.status(404).json("Kolla dina uppgifter")
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
