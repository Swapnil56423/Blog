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

router.post('/signin', (request,response)=>{
    const { email, password } = request.body

    const connection = db.openConnection()
  
    // encrypt the password
    const encryptedPassword = cryptoJs.MD5(password)
  
    const statement = `
    select 
      id, firstName, lastName from user 
    where 
      email = '${email}' and 
      password = '${encryptedPassword}'`
  
    connection.query(statement, (error, users) => {
      connection.end()
  
      if (error) {
        response.send(utils.createResult(error))
      } else if (users.length == 0) {
        // there is no user matching the criteria
        response.send(utils.createResult('user not found'))
      } else {
        const user = users[0]
        response.send(utils.createResult(null, user))
      }
    })

})

router.post('/forgot-password', (request, response) => {
    response.send('forgot-password')
})
  
router.post('/reset-password', (request, response) => {
    response.send('reset-password')
})

 // used to export the router which has all the apis added
 module.exports = router