var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// grab the Todo model
var Person = require('../models/person');
var Todo = require('../models/todo');

 var crypto = require('crypto')
//api routes
router.get('/api/get',function(req,res){
    console.log('IN USER API GET');
    console.log('req.session.user is ' + req.session.user);

Person.findOne({ name : req.session.user.name}).populate('todos').exec(function(err, doc){
    console.log('doc.name '+doc.name)
    res.json(doc.name)
// 	doc.findOne({}, 'todos', function (err, person) {
//     if (err) return handleError(err);
//    res.json(person.todos);
//     })
// console.log('current user database ' + doc);
//  current user database { _id: 592c885e721631b106000001,
//   name: 'qwer',
//   password: 'liAS0JuBcNkS8GafbX2dBw==',
//   __v: 0,
//   todos: [] }
});



});
/* GET users listing. */
router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
  res.sendFile('login.html',{ root: "public" });
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res) {  
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    console.log('req.body.username is ' + req.body.username);
    Person.findOne({ 'name': req.body.username },  function(err, user) { 
        console.log('find user is ' + user);
        if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/user/login'); 
        }
        if (user.password != password) { 
            console.log('用户口令错误');
            req.flash('error', '用户口令错误'); 
            return res.redirect('/user/login');
        }
       // user.loggedin = true;
        req.session.user = user; 
        console.log('req.session.user is ' + req.session.user);
        console.log('登入成功');
        req.flash('success', '登入成功'); 
        res.redirect('/list');
    }); 
});
router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {   
    console.log('logout     '+req.session.user.name);
    Person.findOne(req.session.user.name,function(err,user){
      console.log('Found User  ' + user);
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/user/login'); 
    }
    req.session.user = null;
    req.flash('success', '登出成功'); 
    res.redirect('/about'); 
    }) 

});
router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.sendFile('register.html',{ root: "public" });
});
router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res) { //检验用户两次输入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) 
    {
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/user/reg'); 
    }
    console.log('password match!!!!');
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new Person({ 
        name: req.body.user, 
        password: password,
    });
    console.log('newUser.name' + newUser.name)
    //检查用户名是否已经存在
    Person.findOne({'name':newUser.name}, function(err, user) 
    {        
        console.log('Return is'+ user);//Return is null
        if (user){//为啥一定要这样 才能满足if
            console.log('已经存在');
            req.flash('error', 'Username already exists.'); 
            return res.redirect('/user/reg');
        }
        console.log('newUser'+newUser);
          newUser .save(function(err){
        if(err){
            res.send(err);
        }
        req.session.user = newUser; 
        
        console.log('注册成功');
        res.redirect('/');

    })
     });
    //如果不存在则新增用户 

   
});

function checkLogin(req, res, next) { 
    console.log('checkLogin');
    
    if (!req.session.user) {
        console.log('未登入');
        req.flash('error', '未登入');
        return res.redirect('/user/login'); 
    }
    next(); 
    }

function checkNotLogin(req, res, next) {
      console.log('checkNotLogin');
      console.log('req.session.user is ' + req.session.user);
      if (req.session.user) {
        console.log('已登入');
        req.flash('error', '已登入');
        return res.redirect('/');
      }
    next(); 
    }


module.exports = router;
