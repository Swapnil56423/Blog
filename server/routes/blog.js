const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

router.post('/', (request, response) => {
    const { title, details, userId, tags } = request.body
  
    const statement = `
      insert into blog
        (title, details, userId, tags)
      values 
        ('${title}', '${details}', '${userId}', '${tags}')
    `
  
    const connection = db.openConnection()
    connection.query(statement, (error, result) => {
      connection.end()
      response.send(utils.createResult(error, result))
    })
 })

router.put('/:id', (request, response) => {
    const { title, details, tags } = request.body
    const { id } = request.params
  
    const statement = `
      update blog
      set 
        title = '${title}', 
        details = '${details}', 
        tags = '${tags}'
      where
        id = ${id}
    `
  
    const connection = db.openConnection()
    connection.query(statement, (error, result) => {
      connection.end()
      response.send(utils.createResult(error, result))
    })
 })
  
router.delete('/:id', (request, response) => {
    const { id } = request.params
  
    const statement = `
      delete from blog
      where
        id = ${id}
    `
  
    const connection = db.openConnection()
    connection.query(statement, (error, result) => {
      connection.end()
      response.send(utils.createResult(error, result))
    })
 })
  
  
