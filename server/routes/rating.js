const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

router.get('/:id', (request, response) => {
  const { id } = request.params

  const statement = `
    select 
      blog_rating.rating, 
      blog_rating.createdTimestamp, 
      user.firstName, 
      user.lastName
    from blog_rating, user
    where 
      blog_rating.userId = user.id and
      blog_rating.blogId = ${id}
  `

  const connection = db.openConnection()
  connection.query(statement, (error, result) => {
    connection.end()
    response.send(utils.createResult(error, result))
  })
})

router.get('/:id/aggregate', (request, response) => {
  const { id } = request.params

  const statement = `
    select 
      AVG(rating) as avg
    from blog_rating
    where 
      blogId = ${id}
  `

  console.log(statement)
  const connection = db.openConnection()
  connection.query(statement, (error, records) => {
    connection.end()
    response.send(utils.createResult(error, records[0]))
  })
})

router.post('/:id', (request, response) => {
  const { id } = request.params
  const { userId, rating } = request.body

  const ratingStatusStatement = `
    select * from blog_rating 
    where userId = ${userId} and blogId = ${id}
  `
  const connection = db.openConnection()
  connection.query(ratingStatusStatement, (error, records) => {
    if (error) {
      connection.end()
      response.send(utils.createResult(error))
    } else {
      const statement =
        records.length == 0
          ? `
            insert into blog_rating 
              (userId, blogId, rating)
            values
              (${userId}, ${id}, '${rating}')
          `
          : `
            update blog_rating
            set rating = ${rating}
            where userId = ${userId} and blogId = ${id}
          `

      connection.query(statement, (error, result) => {
        connection.end()
        response.send(utils.createResult(error, result))
      })
    }
  })
})

module.exports = router
