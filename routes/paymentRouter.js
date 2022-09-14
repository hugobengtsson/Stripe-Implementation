import express from 'express'
import { createPayment, verifyPayment } from '../controllers/paymentControllers.js'

export const router = express.Router()

router.post("/create-payment", createPayment)

router.post("/verify-payment", verifyPayment)