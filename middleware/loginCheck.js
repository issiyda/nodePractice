const loginCheck = (req, res, next) => {
    if(req.session.login){
        next()
    }else {
        res.redirect("/auth/login")
    }
}

module.exports = loginCheck