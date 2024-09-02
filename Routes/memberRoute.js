const express = require("express")
const memberRouter = express.Router()
const { param,body } = require('express-validator')
const { getMember, setMember} = require('../Controllers/memberControllers')

memberRouter.route('/').post(body('username', 'password').isString().withMessage("username or password should be a string").
notEmpty().withMessage("fields are empty!"),setMember)
memberRouter.route('/:id').get(param('id').notEmpty().withMessage('id is empty!').isMongoId().withMessage('invalid Id format!'),getMember)

module.exports = memberRouter