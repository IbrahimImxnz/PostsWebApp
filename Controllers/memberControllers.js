const asyncHandler = require('express-async-handler')
const Member = require('../models/members')
const {validationResult} = require('express-validator')

const getMember = asyncHandler(async(req,res)=>{
    const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({success : false, message : result.array()})
    }
    const member = await Member.findById(req.params.id)
    if(!member) return res.status(404).send("Student not found")
    res.send(member)    
})

const setMember = asyncHandler(async(req,res)=>{
    const { username, password } = req.body
    const result = validationResult(req)
    if (!result.isEmpty()){
        return res.status(400).json({ success : false, message : result.array()})
    }
    const member = await Member.create({
        username : username, 
        password : password,
    })
    res.status(200).json(member)
})

module.exports = {getMember, setMember}