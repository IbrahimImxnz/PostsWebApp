const express = require("express")
const postRouter = express.Router()
const { param,body } = require('express-validator')
const { getPost, setPost} = require('../Controllers/postControllers')

postRouter.route('/').post(body('title','text').isString().withMessage("title or text should be a string").
notEmpty().withMessage("fields are empty!"),body('member_id','section_id').notEmpty().withMessage("Ids are empty!").isMongoId().withMessage("Id formats are incorrect!"),setPost)
postRouter.route('/:id').get(param('id').notEmpty().withMessage('id is empty!').isMongoId().withMessage('invalid Id format!'),getPost)

module.exports = postRouter