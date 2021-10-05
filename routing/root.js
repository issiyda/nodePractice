const User = require("../models/user")

const router = require("express").Router()

router.get("/login", (req, res) => {
    res.sendFile(__dirname + "/views/login.html")
})

router.post("/login", (req, res) => {
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

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/")
    })
})

// router.use((req, res, next) => {
//     if(req.session.user) {
//         next()
//     } else {
//         res.redirect("/login")
//     }
// })

router.get("/", (req, res) => {
    res.send("Hello World!!")
})

router.get("/users", (req, res) => {
    const sql = "SELECT * FROM users"
    db.query(sql, function( err, result) {
        if (err) throw err
        res.send(result)
    })
})

// router.get("/usersList", (req, res) => {
    // const sql = "SELECT * FROM users"
//     db.query(sql, function( err, result) {
//         if (err) throw err
//         res.render("index",{users : result})
//     })
// })

// sequelizeのReadで書き換え
router.get("/usersList",  async (req, res) => {
    const users = await User.findAll()
    res.render("index",{users: users})
})

// ユーザ作成フォーム表示
router.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "views/form.html"))
})

// // ユーザ作成
// router.post("/create", (req, res) => {
//     const sql = "INSERT INTO users SET ?"
//     db.query(sql, req.body, function (err, result) {
//         if (err) throw err;
//         res.send("登録完了")
//     })
// })

// ユーザ作成
router.post("/create", async (req, res) => {
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
router.get("/edit/:id", (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?"
    db.query(sql, [req.params.id], function(err, result){
        if (err) throw err
        res.render('edit', {user: result})
    })
})

// ユーザ更新
// router.post("/edit/:id", (req, res) => {
//     const sql = "update users set ? where id = " + req.params.id
//     db.query(sql, req.body, function (err, result) {
//         if (err) throw err;
//         res.redirect("/usersList")
//     })
// })

router.post("/edit/:id", async (req, res) => {
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
router.get("/delete/:id", (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?"
    db.query(sql, [req.params.id], function(err, result){
        if (err) throw err
        res.redirect("/usersList")
    })
})

// sequelizeでDelete
router.get("/delete/:id", async (req, res) => {
    await User.destroy({
        where: { id: req.params.id}
    })
    res.redirect("/usersList")
})

router.get("/cookie", (req, res) => {
    const answer = req.cookies.answer
    res.render("cookie", { answer })
})

router.post("/cookie", (req, res) => {
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

module.exports = router
