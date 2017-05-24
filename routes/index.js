var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// grab the Todo model
var Todo = require('../models/model');

router.get('/about', function(req, res){
    console.log('angular应用首页的位置');
    res.sendFile('welcome.html',{ root: "public" }); 
});

/* restful api */
//get all todo
router.get('/api/todos', function (req, res, next) {
    console.log('get api todo');
        Todo
        .find()
        // .sort('-update_at')
        .exec(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
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
                .find()
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
    Todo.findById(req.params.id, function (err, todo) {
        todo.editing = true;
        todo.save(function (err, todo) {
            if (err) {
                res.send(err);
            }
            Todo
                .find()
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
                .find()
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
    console.log(req.body);
    console.log(req.body.content);
    console.log(req.headers);
    new Todo({
        content : req.body.content
    }).save(function(err){
        if(err){
            res.send(err);
        }
        Todo
            .find()
            .exec(function(err, todos){
                if(err){
                    res.send(err);
                }
                res.json(todos);
            });
    })
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
                .find()
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

module.exports = router;

