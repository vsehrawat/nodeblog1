var express = require('express');
var router = express.Router();
var util = require('util');

var mongo = require('mongodb');
var db = require('monk')('mongodb://dbusername:dbpassword@ds147267.mlab.com:47267/nodeblog');


router.get('/add', function(req, res, next){
         res.render('addcategory',{
        'title':'Add Category'
        });
});

router.get('/:category', function(req, res, next){
         
         var query = {'category':req.params.category};
         var postObj = db.get('posts');
          postObj.find(query, {}, function(err, posts){
            console.log(util.inspect(posts))
            res.render('index',{
                'title':'Post in category',
                'posts':posts
                });
          });
});


router.post('/add', function(req, res, next) {
  // Get Form Values
  var name = req.body.name;
    console.log(name);  
    req.checkBody('name','Name cannot be empty');

    var errors = req.validationErrors();

    if(errors){
        res.render('addcategory', {"errors": errors });
    }else{
        var categories = db.get('categories');
        categories.insert({"name":name}, function(error, category){
            if(error){
                res.send(error);
            }else{
                req.flash('success','Category is added')
                res.redirect('/');
            }
        });
    }

});

/*
router.post('/add', upload.single('mainimage'), function(req, res, next){
    var title = req.body.title;
    var body = req.body.body;
    var author = req.body.author;
    var category = req.body.category;
    var date = new Date();
    
    if(req.file){
        var mainimage = req.file.filename;
    } else{
        var mainimage = "noimage.jpg";
    }

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    var errors = req.validationErros();

    if(errors){
        res.render('addpost',{"errors": errors, "title":title, "body":body });
    } else{
        var posts = db.get('posts');
        posts.insert({'title': title, 'body': body, 'category':category, 'date':date, 'author':author, 'mainimage':mainimage}, function(err, post){
            if(err){
                res.send(err);
            }else{
                req.flash('success','Post added'),
                res.location('/');
                res.redirect('/');
            }
        });
    }
});
*/
module.exports = router;

