const User = require('../models/user');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const loginCheck = require('../middleware/loginCheck');
router.get('/register', (req, res) => {
  console.log('新規登録画面の表示');
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  const params = req.body;
  const password = await bcrypt.hash(params.password, 10);
  try {
    const user = await User.findOrCreate({
      where: { email: params.email },
      defaults: {
        name: params.name,
        email: params.email,
        type: 2,
        password
      }
    });
    if (user) {
      res.redirect('/auth/login');
    }
    return res.render('auth/register');
  } catch (err) {
    return res.status(400).json({
      error: {
        message: err.message
      }
    });
  }
});

router.get('/login', (req, res) => {
  console.log('ログイン画面の表示');
  if (req.session.login) {
    res.redirect('/home');
  }
  res.render('auth/login', { message: '' });
});

router.post('/login', async (req, res) => {
  try {
    console.log('ログイン確認');
    const params = req.body;
    const user = await User.findOne({
      where: {
        email: params.email
      }
    });
    console.log('user', user);
    const match = await bcrypt.compare(params.password, user.password);
    console.log('match', match);
    if (match) {
      console.log('マッチしました');
      req.session.login = user.name;
      res.render('home', { name: req.session.login, isLogin: true });
    }
  } catch (err) {
    console.log('error', err);
    res.render('auth/login', {
      message: 'メールアドレスもしくはパスワードが違います。'
    });
  }
});

router.get('/logout', (req, res) => {
  console.log('ログアウトする');
  req.session.login = undefined;
  res.redirect('/');
});

module.exports = router;
