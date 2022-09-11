const mysql = require('mysql')
const express = require('express')
const session = require('express-session')
const path = require('path')

const app = express()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: ''
})

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'static')))

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'))
}) 

app.post('/auth', function(request, response) {
    let username = request.body.username
    let password = request.body.password

    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error
            if (results.length > 0) {
                request.session.loggedin = true
                request.session.username = username
                response.redirect('/home')
            } else {
                response.send('Incorrect Username and/orPassword!')
            }
            response.end()
        })
    } else {
        response.send('Please enter Username and Password!')
        response.end()
    }
})