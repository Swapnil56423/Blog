const mysql2 = require('mysql2/promise')

const openconnection2 = async () => {
    const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'manager',
        database: 'blog_db',
        port: 3306
    })

    return connection
}

module.exports = openconnection2

   
