const express = require('express')

const app = express()
// envファイル読み込み
require("dotenv").config()
// formのデータ受け取り
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const ejs = require('ejs') 

const port = 3000
const path = require("path")
const mysql = require("mysql")
const cookieParser = require("cookie-parser")
const session = require("express-session")

// sequelize
const sequelize = require("./db/db-config")
const User = require("./models/user")


//　定数
const { USER_TYPE } = require("./utils/constants")

const sessionInfo = {
    secret: "nodePractice",
    cookie: { maxAge: 300000},
    resave: false,
    saveUninitialized: false
}

app.use(cookieParser())
// sessionが使えるように
app.use(session(sessionInfo))

const db = mysql.createConnection({
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    port: process.env.LOCAL_DB_PORT
})

db.connect((err) => {
    if (err) throw err
    console.log("mysql に接続できました")
})

app.use("/", require("./routing/root"))


app.listen(port, () => console.log(`listen!! ${port}`))