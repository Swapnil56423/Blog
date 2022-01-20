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

 router.get('/details/:id', (request, response) => {
  // async function is needed to use await inside it
  const searchBlogs = async () => {
    const { id } = request.params

    const statement = `
      select 
        blog.id,
        blog.userId,
        blog.title, 
        blog.details,
        blog.tags, 
        blog.createdTimestamp, 
        user.firstName, 
        user.lastName
      from blog, user
      where 
        blog.userId = user.id and
        blog.id = ${id}
      order by blog.createdTimestamp DESC
    `

    // wait till mysql connection is open
    const connection = await db.openConnection2()

    // wait till the query gets executed
    const [blogs] = await connection.query(statement)

    for (let blog of blogs) {
      // for every blog get the like count
      const [likeResult] = await connection.query(
        `select count (*) as count from blog_like_status where blogId = ${blog.id} and type = 1`
      )

      // get the like count from result
      // likeResult =  [ { count: 1 } ]
      blog['likeCount'] = likeResult[0]['count']

      // for every blog get comments
      const [comments] = await connection.query(`
          select 
            blog_comment.id,
            blog_comment.comment, 
            blog_comment.createdTimestamp, 
            user.firstName, 
            user.lastName
          from blog_comment, user
          where 
            blog_comment.userId = user.id and
            blog_comment.blogId = ${blog.id}
        `)
      blog['comments'] = comments

      // get ratings for every blog
      const [ratings] = await connection.query(`
        select 
          blog_rating.rating, 
          blog_rating.createdTimestamp, 
          user.firstName, 
          user.lastName
        from blog_rating, user
        where 
          blog_rating.userId = user.id and
          blog_rating.blogId = ${blog.id}
      `)

      blog['ratings'] = ratings
    }

    connection.end()

    // since we are getting details of only one blog
    // it makes sense to send only one object
    // instead of sending the array
    response.send(utils.createResult(null, blogs[0]))
  }

  searchBlogs()
})

router.get('/search', (request, response) => {
  // async function is needed to use await inside it
  const searchBlogs = async () => {
    const { user, title, tag } = request.query

    const conditions = []

    // check if user parameter exists in query string
    // /blog/search?user=1
    if (user) {
      conditions.push(` userId = ${user} `)
    }

    // check if title parameter exists in query string
    // /blog/search?title=react
    if (title) {
      conditions.push(` title like '%${title}%' `)
    }

    // check if tag parameter exists in query string
    // /blog/search?tag=js
    if (tag) {
      conditions.push(` tags like '%${tag}%' `)
    }

    let where = ''
    if (conditions.length > 0) {
      where = ` and ${conditions.join(' and ')} `
    }

    const statement = `
      select 
        blog.id,
        blog.userId,
        blog.title, 
        blog.details,
        blog.tags, 
        blog.createdTimestamp, 
        user.firstName, 
        user.lastName
      from blog, user
      where 
        blog.userId = user.id
        ${where}
      order by blog.createdTimestamp DESC
    `

    // wait till mysql connection is open
    const connection = await db.openConnection2()

    // wait till the query gets executed
    const [blogs] = await connection.query(statement)

    for (let blog of blogs) {
      // for every blog get the like count
      const [likeResult] = await connection.query(
        `select count (*) as count from blog_like_status where blogId = ${blog.id} and type = 1`
      )

      // get the like count from result
      // likeResult =  [ { count: 1 } ]
      blog['likeCount'] = likeResult[0]['count']

      // get ratings for every blog
      const [ratings] = await connection.query(`
        select 
          blog_rating.rating, 
          blog_rating.createdTimestamp, 
          user.firstName, 
          user.lastName
        from blog_rating, user
        where 
          blog_rating.userId = user.id and
          blog_rating.blogId = ${blog.id}
      `)

      blog['ratings'] = ratings
    }

    connection.end()
    response.send(utils.createResult(null, blogs))
  }

  searchBlogs()
})

module.exports = router
  
  
