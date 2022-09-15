import express from 'express'
import { getOrders } from '../controllers/orderControllers.js'

export const router = express.Router()

router.get("/getOrders", getOrders)