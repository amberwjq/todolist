var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// grab the Todo model
var Person = require('../models/person');
 var crypto = require('crypto')
/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.sendFile('login.html',{ root: "public" });
});
router.get('/reg', function(req, res, next) {
  res.sendFile('register.html',{ root: "public" });
});

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
        // newUser.save(function(err) {
        // if (err) {
        // req.flash('error', err); 
        // return res.redirect('/user/reg'); 
        // }
        // req.session.user = newUser; 
        // console.log('注册成功');
        // req.flash('success', '注册成功'); 
        // res.redirect('/');
        // }); 
        console.log('newUser'+newUser);
          newUser .save(function(err){
        if(err){
            res.send(err);
        }
        req.session.user = newUser; 
        console.log('注册成功');
    })
     });
    //如果不存在则新增用户 

   
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
