var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register' });
});

//post register result
router.post('/registeruser', function (req, res) {
  console.log('came here...');
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/learn';

  // Connect to the server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');

      // Get the documents collection
      var collection = db.collection('user');

      // Get the student data passed from the form
      var user = {
        email: req.body.email, password: req.body.password, name: req.body.name
      };

      // Insert the student data into the database
      collection.insert([user], function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          // Redirect to the updated student list
          res.redirect("/");
        }

        // Close the database
        db.close();
      });

    }
  });

  

});

router.post('/thelist', function (req, res) {

    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;

    // Define where the MongoDB server is
    var url = 'mongodb://localhost:27017/learn';

    // Connect to the server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        // We are connected
        console.log('Connection established to', url);

        // Get the documents collection
        var collection = db.collection('user');

        collection.find({ email: req.body.email, password: req.body.password }).toArray(function (err, result) {
          console.log(result);
          if (result.length > 0) {
            // Find all students
            collection.find({}).toArray(function (err, result) {
              if (err) {
                res.send(err);
              } else if (result.length) {
                res.render('userlist', {

                  // Pass the returned database documents to Jade
                  "userlist": result
                });
              } else {
                res.send('No documents found');
              }
              //Close connection
              db.close();
            });
          } else {
            console.log("Ivalid credentials");
            res.render('index', { title: 'Express' });
          }
        })

      }
    });
  });

  router.post('/updateuser/:name', function (req, res) {
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/learn';

  // Connect to the server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('unable to connect');
    } else {
      var collection = db.collection('user');
      var user = {
        name: req.body.name, email: req.body.email,
        password: req.body.password
      };
      console.log(req.params.name);
      console.log(user);
      collection.findOneAndUpdate({name:req.params.name}, user, function (err, obj) {
        if (err) throw err;
        else console.log("updated");
      })
       res.render('index', { title: 'Express' });
    }
  })
})


router.get('/delete/:name', function (req, res) {
  console.log('delete came here...')
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/learn';

  // Connect to the server
  MongoClient.connect(url, function (err, db) {
    console.log(req.params.name);
    if (err) {
      console.log('unable to connect');
    } else {
      var collection = db.collection('user');
      collection.deleteOne({ name: req.params.name }, function (err, obj) {
        if (err) throw err;
        else console.log("deleted");

        res.render('index', { title: 'Express' });
      })
    }
  })
});

router.get('/update/:name', function (req, res) {
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/learn';
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    else {
      var collection = db.collection('user');
      collection.find({ name: req.params.name }).toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
          console.log(result);
          res.render('updateuser', {

            // Pass the returned database documents to Jade
            "user": result[0]
          });
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });

    }
  })
})


module.exports = router;
