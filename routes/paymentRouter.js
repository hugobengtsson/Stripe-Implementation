import express from 'express'
import { createPayment } from '../controllers/paymentControllers.js'

export const router = express.Router()

router.post("/create-payment", createPayment)