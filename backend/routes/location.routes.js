import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { getLocation } from '../controllers/location.controllers.js'

const locationRouter = express.Router()

locationRouter.get("/geocode",getLocation)

export default locationRouter