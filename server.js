const express = require("express")
const app = express()
const connectDB = require("./config")
require("dotenv").config()
const memberRouter = require('./Routes/memberRoute')
const sectionRouter = require('./Routes/sectionRoute')
const postRouter = require('./Routes/postRoute')

connectDB()

app.use(express.json())
// app.use(express.urlencoded({extended:false}))

app.use('/api/member', memberRouter)
app.use('/api/section', sectionRouter)
app.use('/api/post',postRouter)

const port = process.env.PORT || 7000
app.listen(port, ()=>console.log(`listening to port ${port}`))