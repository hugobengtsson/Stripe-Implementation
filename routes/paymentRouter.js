import express from 'express'
import { createPaymentIntent } from '../controllers/paymentControllers.js'

export const router = express.Router()

// Get all products
router.post("/create-payment-intent", createPaymentIntent) 