const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

router.get('/:id', (request, response) => {
  const { id } = request.params

  const statement = `
    select 
      blog_comment.comment, 
      blog_comment.createdTimestamp, 
      user.firstName, 
      user.lastName
    from blog_comment, user
    where 
      blog_comment.userId = user.id and
      blog_comment.blogId = ${id}
  `

  const connection = db.openConnection()
  connection.query(statement, (error, result) => {
    connection.end()
    response.send(utils.createResult(error, result))
  })
})

router.post('/:id', (request, response) => {
  const { id } = request.params
  const { userId, comment } = request.body

  const statement = `
    insert into blog_comment 
      (userId, blogId, comment)
    values
      (${userId}, ${id}, '${comment}')
  `

  const connection = db.openConnection()
  connection.query(statement, (error, result) => {
    connection.end()
    response.send(utils.createResult(error, result))
  })
})

router.put('/:id', (request, response) => {
  // exercise
  response.send('edit a comment')
})

router.delete('/:id', (request, response) => {
  // exercise
  response.send('delete a comment')
})

module.exports = router
