import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from 'cors'
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import shopRouter from "./routes/shop.routes.js"
import itemRouter from "./routes/item.routes.js"
import locationRouter from "./routes/location.routes.js"
import orderRouter from "./routes/order.routes.js"

import http from 'http'
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin: "http://localhost:5173",
    credentials: true,
    methods:['POST','GET']
  }
})

app.set("io",io)

const port = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)
app.use("/api/location",locationRouter)

socketHandler(io)

app.get("/", (req, res) => {
  res.send("API is running....")
})

server.listen(port,()=>{
    console.log(`Server running in development mode on port ${port}`)
    connectDb()
})