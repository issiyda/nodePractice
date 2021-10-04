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


app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/views/login.html")
})

app.post("/login", (req, res) => {
    const user = req.body.user
    const password = req.body.password
    if(user === 'node' && password === "password"){
        req.session.regenerate((err) => {
            req.session.user = "node"
            res.redirect("/")
        })
    } else {
        res.redirect("/login")
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/")
    })
})

// app.use((req, res, next) => {
//     if(req.session.user) {
//         next()
//     } else {
//         res.redirect("/login")
//     }
// })

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

// app.get("/usersList", (req, res) => {
    // const sql = "SELECT * FROM users"
//     db.query(sql, function( err, result) {
//         if (err) throw err
//         res.render("index",{users : result})
//     })
// })

// sequelizeのReadで書き換え
app.get("/usersList",  async (req, res) => {
    const users = await User.findAll()
    res.render("index",{users: users})
})

// ユーザ作成フォーム表示
app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "views/form.html"))
})

// // ユーザ作成
// app.post("/create", (req, res) => {
//     const sql = "INSERT INTO users SET ?"
//     db.query(sql, req.body, function (err, result) {
//         if (err) throw err;
//         res.send("登録完了")
//     })
// })

// ユーザ作成
app.post("/create", async (req, res) => {
    const params = req.body
    await User.create({
        type: USER_TYPE.USER,
        name: params.name,
        email: params.email,
        password: params.password,
    })
    res. redirect('usersList')
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
// app.post("/edit/:id", (req, res) => {
//     const sql = "update users set ? where id = " + req.params.id
//     db.query(sql, req.body, function (err, result) {
//         if (err) throw err;
//         res.redirect("/usersList")
//     })
// })

app.post("/edit/:id", async (req, res) => {
    const params = req.body
    await User.update({
        name: params.name,
        email: params.email,
        password: params.password,
    }, {
        where: { id: req.params.id}
    })
    res.redirect('/usersList')
})

// ユーザ削除
app.get("/delete/:id", (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?"
    db.query(sql, [req.params.id], function(err, result){
        if (err) throw err
        res.redirect("/usersList")
    })
})

// sequelizeでDelete
app.get("/delete/:id", async (req, res) => {
    await User.destroy({
        where: { id: req.params.id}
    })
    res.redirect("/usersList")
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