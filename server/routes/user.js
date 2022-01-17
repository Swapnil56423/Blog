const express = require('express')
const db = require('../db')
const utils =require('../utils')
const cryptoJs = require('crypto-js')

// router which helps user module to add all the routes to the main app
const router = express.Router()

router.post('/signup',(request, response) => {

    // extract the properties of request.body (json) to
    // const separate variables
    const{ firstName, password, lastName, email}=request.body

    const connection = db.openConnection()

    const emailStatement = `select email from user where email = '${email}'`
    
    connection.query(emailStatement, (error, emails) => {
        if (error) {
          // if error is generated while executing the query
          response.send(utils.createResult(error))
        } else {
          if (emails.length == 0) {
            // encrypt the password
            const encryptedPassword = cryptoJs.MD5(password)
    
            // there is no user registered with this email
            const statement = `
            insert into user
              (firstName, lastName, email, password)
            values
              ('${firstName}', '${lastName}', '${email}', '${encryptedPassword}')
          `
            connection.query(statement, (error, result) => {
              connection.end()
              response.send(utils.createResult(error, result))
            })
          } else {
            // at least one user exists with this email address
            connection.end()
            response.send(
              utils.createResult('email address already exists, please use another')
            )
          }
        }
      })
})
