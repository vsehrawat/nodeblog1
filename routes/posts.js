var express = require('express');
var router = express.Router();
var util = require('util');
var multer = require('multer');

var mongo = require('mongodb');
var db = require('monk')('mongodb://dbusername:dbpassword@ds147267.mlab.com:47267/nodeblog');
var upload = multer({dest: './public/images/post'});

router.get('/add', function(req, res, next){
    var categories = db.get('categories');
    categories.find({},{}, function(err, categories){
         res.render('addpost',{
        'title':'Add Post',
        'categories': categories
        });
    });
});

router.get('/show/:postid', function(req, res, next){
    console.log(req.params.postid);
    //res.send("the parameter received is " + req.params["postid"]); 
    var query = {'_id': req.params.postid };

    var posts = db.get('posts');

    posts.find(query, {}, function(err, post){
        if (err) throw err;
        console.log("Post : " + util.inspect(post));
        res.render('postdetail',{'title':'Post Detail','post': post[0]});
    });
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  // Get Form Values
  var title = req.body.title;
  var category= req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();

  // Check Image Upload
  if(req.file){
  	var mainimage = req.file.filename
  } else {
  	var mainimage = 'noimage.jpg';
  }

  	// Form Validation
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors": errors
		});
	} else {
		var posts = db.get('posts');
		posts.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainimage
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','Post Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

router.post('/addcomment', function(req, res, next) {
  // Get Form Values
  var name = req.body.name;
  var email= req.body.email;
  var body = req.body.body;
  var postid = req.body.postid;
  var commentdate = new Date();

  	// Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required but never displayed').notEmpty();
	req.checkBody('email', 'Email is not formated properly').isEmail();
    req.checkBody('body','Comment field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
        var posts = db.get('posts');
        posts.findById(postid, function(err, post){
                res.render('postdetail',{
			    "errors": errors,
                "post":post
		    });
        });
		
	} else {
		var comment = {"name":name, 'email':email, 'body':body, 'commentdate':commentdate};
        var posts = db.get('posts');
        posts.update({
            "_id": postid
        },{$push:{'comments':comment}}, function(err, doc){
            if (err) throw err;
            req.flash('success','Comment Added');
            res.redirect('/posts/show/' + postid );
        });
	}
});


module.exports = router;

