const express = require('express')
const routerUser = require('./routes/user')
const routerBlog = require('./routes/blog')

const app = express()

// add the json parser to parse the json data sent through
// the request body
app.use(express.json())

// use the router to find all the apis related to the user
app.use('/user', routerUser)

// use the router to find all the apis related to the blogs
app.use('/blog', routerBlog)


app.listen(4000, () => {
    console.log(`server started on port 4000`)
  })