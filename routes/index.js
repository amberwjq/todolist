var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// grab the Todo model
var Todo = require('../models/todo');
var Person = require('../models/person');
router.get('/about', function(req, res){
    console.log('angular应用首页的位置');
    res.sendFile('welcome.html',{ root: "public" }); 
});
router.get('/list', checkLogin);
router.get('/list', function(req, res){
    console.log(' list 应用首页的位置');
    res.sendFile('index.html',{ root: "public" }); 
});

/* restful api */
//get all todo
router.get('/api/todos', function (req, res, next) {
    console.log('get api todo');
    console.log('req.session.user '+ req.session.user);



Person.findOne({ name : req.session.user.name}).exec(function(err, doc){
    Todo
        .find({ '_creator': doc._id})
        .exec(function(err, todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
            });
// console.log('current user database ' + doc);
//  current user database { _id: 592c885e721631b106000001,
//   name: 'qwer',
//   password: 'liAS0JuBcNkS8GafbX2dBw==',
//   __v: 0,
//   todos: [] }
});

});



//删除后返回所有
router.delete('/api/todo/:id', function (req, res, next) {
    Todo.findById(req.params.id, function (err, todo) {
        todo.remove(function (err, todo) {
            if (err) {
                res.send(err);
            }
            Todo
                .find({'_creator': req.session.user._id})
                .sort('-update_at') //更加日期排序
                .exec(function (err, todos) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(todos);
                });
        })
    })
});

//enable editing

//working one
router.put('/api/todo/get/:id', function (req, res, next) {
    console.log('IN API TODO GET by ID');
    Todo.findById(req.params.id, function (err, todo) {
        todo.editing = true;
        todo.save(function (err, todo) {
            if (err) {
                res.send(err);
            }
            Todo
                .find({'_creator': req.session.user._id})
                .sort('-update_at') //更加日期排序
                .exec(function (err, todos) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(todos);
                });
        })
    })
});

router.put('/api/todo/done/:id', function (req, res, next) {
    Todo.findById(req.params.id, function (err, todo) {
        if(todo.completed){
            todo.completed = false;
        }else{
           todo.completed = true; 
        } ;
        todo.save(function (err, todo) {
            if (err) {
                res.send(err);
            }
            Todo
                .find({ '_creator': req.session.user._id})
                .sort('-update_at') //更加日期排序
                .exec(function (err, todos) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(todos);
                });
        })
    })
});



//POST that create todo and return all todos
router.post('/api/todo', function(req, res, next){
    console.log('IN API TODO');
    console.log(req.body.content);
    console.log('currentUserName '+ req.session.user.name);
    console.log('req.session.user._id ' + req.session.user._id);
    new Todo({
        content : req.body.content,
        _creator: req.session.user._id
    }).save(function(err){
        if(err){
            res.send(err);
        }
        Todo
            .find({ '_creator': req.session.user._id})
            .exec(function(err, todos){
                if(err){
                    res.send(err);
                }
                res.json(todos);
            });
    })
//       var todo1 = new Todo({
//     content : req.body.content,
//         _creator: req.session.user._id  // assign the _id from the person
//   });
//         todo1.save(function (err) {
//             if (err) {
//                 res.send(err);
//             }
//             console.log('updated todo is ' + todo);
//             Todo
//                 .find()
//                 .sort('-update_at') //更加日期排序
//                 .exec(function (err, todos) {
//                     if (err) {
//                         res.send(err);
//                     }
//                     res.json(todos);
//                 });
//         })


});
  //更新操作
router.put('/api/todo/edit/:id', function (req, res, next) {
             console.log(req.body);
    console.log(req.body.content);   
    Todo.findById(req.params.id, function (err, todo) {
        todo.editing = false;
        todo.content = req.body.content;
        todo.save(function (err, todo) {
            if (err) {
                res.send(err);
            }
            console.log('updated todo is ' + todo);
            Todo
                .find({'_creator': req.session.user._id})
                .sort('-update_at') //更加日期排序
                .exec(function (err, todos) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(todos);
                });
        })
    })
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