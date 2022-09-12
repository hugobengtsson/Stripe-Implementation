import { getAllUsers, getLoggedInUser, loginUser, logoutUser, registerUser } from '../controllers/userControllers.js'
import express from 'express'

export const router = express.Router()

// GET all users
router.get("/users", getAllUsers)

// GET logged in user from cookie
router.get("/login", getLoggedInUser)
// Login user
router.post("/login", loginUser)
// Log out user
router.delete("/login", logoutUser)

// Register user
router.post("/register", registerUser)
