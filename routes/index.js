var express = require('express');
var router = express.Router();


var mongo = require('mongodb');
var db = require('monk')('mongodb://dbusername:dbpassword@ds147267.mlab.com:47267/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, function(err, posts){
    res.render('index',{'title':'Home',  posts: posts});
  });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
