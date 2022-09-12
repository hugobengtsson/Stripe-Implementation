import { getAllProducts } from '../controllers/productControllers.js'
import express from 'express'

export const router = express.Router()

// Get all products
router.get("/getAllProducts", getAllProducts) 