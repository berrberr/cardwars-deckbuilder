var express = require("express");
var app = express(),
    config = require("./config"),
    path = require("path"),
    bodyParser = require("body-parser"),
    Cookies = require("cookies"),
    Keygrip = require("keygrip"),
    bcrypt = require("bcrypt"),
    mongoose = require("mongoose"),
    URLSlugs = require('mongoose-url-slugs'),
    mongo = require("mongoskin");

ObjectID = mongo.ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost/cardwars");
var db = mongoose.connection;
var keys = new Keygrip([config.cookieSecret]);

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  auth_token: String
});

var deckSchema = new mongoose.Schema({
  name: String,
  author: String,
  cards: Array,
  description: String,
  updated: { type: Date, default: Date.now }
});
deckSchema.plugin(URLSlugs("name"));

var cardSchema = new mongoose.Schema({
  ability: String,
  atk: String,
  color: String,
  cost: String,
  def: String,
  image: String,
  name: String,
  text: String,
  type: String,
  updated: { type: Date, default: Date.now }
});

var Card = mongoose.model("Card", cardSchema);
var Deck = mongoose.model("Deck", deckSchema);
var User = mongoose.model("User", userSchema);

/**
 * Attempts to get the active user from a request's cookies
 */
var getActiveUser = function(req, res, callback) {
  var cookies = new Cookies(req, res, keys);
  var user_id = cookies.get("user_id", { signed: true });
  var auth_token = cookies.get("auth_token", { signed: true });
  User.findOne({ _id: user_id, auth_token: auth_token }, function(err, user) {
    if(user && user.username) {
      callback.success(user);
    }
    else {
      callback.error(err);
    }
  });
};

/**
 * Helper function to send error message with default 400 status
 */
var sendError = function(res, message, status) {
  res.status(status || 400).send({ error: message });
};

app.get("/auth", function(req, res) {
  var cookies = new Cookies(req, res, keys);
  var user_id = cookies.get("user_id", { signed: true });
  var auth_token = cookies.get("auth_token", { signed: true });
  if(user_id && auth_token) {
    User.findOne({ _id: user_id, auth_token: auth_token }, function(err, result) {
      if(result) {
        res.send({ username: result.username });
      }
      else {
        res.status(401).send("Invalid login cookies.");
      }
    });
  }
  else {
    res.status(401).send("Invalid login cookies.");
  }
});

app.post("/auth/signup", function(req, res) {
  if(req.body && req.body.username && req.body.password) {
    User.find({ username: req.body.username }, function(err, result) {
      if(result.length < 1) {
        var newUser = new User({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),
          auth_token: bcrypt.genSaltSync(8)
        });
        newUser.save(function(err, result) {
          console.log(result);
          if(result) {
            var cookies = new Cookies(req, res, keys);
            cookies.set("auth_token", result.auth_token, { signed: true })
                    .set("user_id", result._id, { signed: true });
            res.send({ username: result.username });
          }
          else {
            res.status(400).send({ error: "There was a problem creating the user." });
          }
        });
      }
      else {
        res.status(400).send({ error: "Username is taken.", stayOnPage: true });
      }
    });
  }
  else {
    res.status(400).send({ error: "Missing username or password.", stayOnPage: true });
  }
});

app.post("/auth/login", function(req, res) {
  console.log(req.body);
  if(req.body && req.body.username && req.body.password) {
    User.findOne({ username: req.body.username }, function(err, result) {
      if(result) {
        if(bcrypt.compareSync(req.body.password, result.password)) {
          var cookies = new Cookies(req, res, keys);
          cookies.set("auth_token", result.auth_token, { signed: true })
                  .set("user_id", result._id, { signed: true });
          res.send({ username: result.username });
        }
        else {
          res.status(401).send({ error: "Invalid username or password." });
        }
      }
      else {
        res.status(401).send({ error: "Username not found." });
      }
    });
  } 
  else {
    res.status(401).send({ error: "Missing username or password." });
  }
});

app.post("/auth/logout", function(req, res) {
  var cookies = new Cookies(req, res, keys);
  cookies.set("auth_token").set("auth_token.sig").set("user_id").set("user_id.sig");
  res.send({ logged_out: true });
});

app.get("/decks/slug/:slug", function(req, res) {
  Deck.findOne({ slug: req.params.slug }, function(err, result) {
    res.send(result);
  });
});

app.get("/decks/author/:author", function(req, res) {
  Deck.find({ author: req.params.author }, function(err, result) {
    res.send(result);
  });
});

app.get("/decks/:id?", function(req, res) {
  if(req.params.id) {
    Deck.findOne({ _id: ObjectID(req.params.id) }, function(err, result) {
      res.send(result);
    });
  }
  else {
    Deck.find({}, function(err, result) {
      res.send(result);
    });
  }
});

app.put("/decks/:id", function(req, res) {
  if(req.body && req.body._id && req.body.name && req.body.author && req.body.cards) {
    Deck.findOne({ _id: ObjectID(req.params.id) }, function(err, result) {
      if(!err) {
        getActiveUser(req, res, {
          success: function(user) {
            console.log(user);
            // Current user must be author of deck & also match the author in request param
            if(result.author === user.username && req.body.author === user.username) {
              Deck.findOneAndUpdate({ _id: ObjectID(req.body._id) }, {
                name: req.body.name,
                author: req.body.author,
                description: req.body.description,
                cards: req.body.cards,
                updated: Date.now()
              }, function(err, result) {
                if(err) {
                  sendError(res, err);
                }
                else {
                  res.send(result);
                }
              });
            }
            else {
              sendError(res, "Wrong user.", 401);
            }
          },
          error: function() {
            sendError(res, "User must be logged in.", 401);
          }
        });

      }
      else {
        sendError(res, "Deck not found.");
      }
    });
  }
  else {
    sendError(res, "Missing one or more deck attributes.");
  }
});

app.post("/decks", function(req, res, next) {
  if(req.body && req.body.name && req.body.author) {
    var newDeck = new Deck(req.body);
    console.log(newDeck);
    newDeck.save(function(err, result) {
      res.send((err === null) ? result : { error : err });
    });
  }
  else {
    res.status(400).send("Authorid or name required.");
  }
});

app.get("/cards/:id?", function(req, res) {
  if(req.params.id) {
    Card.findOne({ _id: ObjectID(req.params.id) }, function(err, result) {
      console.log(result);
      res.send(result);
    });
  }
  else {
    Card.find({}, function(err, result) {
      res.send(result);
    });
  }
});

app.get("/batchcards", function(req, res) {
  if(req.query.ids) {
    var ids = req.query.ids.split(",");
    ids = ids.map(function(id) { return ObjectID(id); });
    Card.find({ _id: { "$in": ids } }, function(err, result) {
      res.send(result);
    });
  }
  else {
    res.status(400).send("Item ids required.");
  }
});

//app.listen(3000);
module.exports = app;
