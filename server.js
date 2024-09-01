const express = require("express")
const app = express()
const connectDB = require("./config")
require("dotenv").config()


connectDB()

app.use(express.json())


const port = process.env.PORT || 7000
app.listen(port, ()=>console.log(`listening to port ${port}`))