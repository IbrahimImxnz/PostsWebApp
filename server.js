const express = require("express")
const app = express()
const connectDB = require("./config")
require("dotenv").config()
const memberRouter = require('./Routes/memberRoute')

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/member', memberRouter)


const port = process.env.PORT || 7000
app.listen(port, ()=>console.log(`listening to port ${port}`))