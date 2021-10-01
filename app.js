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

app.use(cookieParser())

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

app.get("/", (req, res) => {
    res.send("Hello World!!")
})

app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users"
    db.query(sql, function( err, result) {
        if (err) throw err
        res.send(result)
    })
})

app.get("/usersList", (req, res) => {
    const sql = "SELECT * FROM users"
    db.query(sql, function( err, result) {
        if (err) throw err
        console.log(res.users)
        res.render("index",{users : result})
    })
})

// ユーザ作成フォーム表示
app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "views/form.html"))
})

// ユーザ作成
app.post("/create", (req, res) => {
    const sql = "INSERT INTO users SET ?"
    db.query(sql, req.body, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.send("登録完了")
    })
})

// ユーザ更新フォーム表示
app.get("/edit/:id", (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?"
    db.query(sql, [req.params.id], function(err, result){
        if (err) throw err
        res.render('edit', {user: result})
    })
})

// ユーザ更新
app.post("/edit/:id", (req, res) => {
    const sql = "update users set ? where id = " + req.params.id
    db.query(sql, req.body, function (err, result) {
        if (err) throw err;
        res.redirect("/usersList")
    })
})

// ユーザ削除
app.get("/delete/:id", (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?"
    db.query(sql, [req.params.id], function(err, result){
        if (err) throw err
        res.redirect("/usersList")
    })
})

app.get("/cookie", (req, res) => {
    const answer = req.cookies.answer
    res.render("cookie", { answer })
})

app.post("/cookie", (req, res) => {
    console.log("request", req.body)
    let answer = ""
    if(req.body.question === "買う"){
        answer = "買う"
    }else if(req.body.question === "買わない"){
        answer = "買わない"
    }else {
        answer = ""
    }
    res.cookie("answer", answer).redirect("/cookie")
})



app.listen(port, () => console.log(`listen!! ${port}`))