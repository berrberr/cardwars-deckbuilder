var express = require("express");
var app = express(),
    config = require("./config"),
    path = require("path"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    cookieSession = require("cookie-session"),
    bcrypt = require("bcrypt"),
    mongoose = require("mongoose"),
    mongo = require("mongoskin");

ObjectID = mongo.ObjectID;

//var db = mongo.db("mongodb://@localhost:27017/cardwars");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.cookieSecret));           // populates req.signedCookies
app.use(cookieSession(config.sessionSecret));         // populates req.session, needed for CSRF

mongoose.connect("mongodb://localhost/cardwars");
var db = mongoose.connection;

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  auth_token: String
});

var deckSchema = new mongoose.Schema({
  name: String,
  author_id: String,
  cards: Array,
  updated: { type: Date, default: Date.now }
});

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

app.get("/auth", function(req, res) {
  if(req.signedCookies.user_id && req.signedCookies.auth_token) {
    User.findOne({ _id: req.signedCookies.user_id, auth_token: req.signedCookies.auth_token }, function(err, result) {
      if(result) {
        res.send({ username: result.username });
      }
      else {
        res.status(400).send("Invalid login cookies.");
      }
    });
  }
  else {
    res.status(400).send("Invalid login cookies.");
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
        newUser.save(function(err, response) {
          if(response) {
            res.cookie("user_id", response._id, { signed: true, maxAge: config.cookieMaxAge });
            res.cookie("auth_token", response.auth_token, { signed: true, maxAge: config.cookieMaxAge });
            res.send({ username: result.username });
          }
          else {
            res.status(400).send("There was a problem creating the user.");
          }
        });
      }
      else {
        res.status(400).send("Username is taken.");
      }
    });
  }
  else {
    res.status(400).send("Missing username or password.");
  }
});

app.post("/auth/login", function(req, res) {
  if(req.body && req.body.username && req.body.password) {
    User.findOne({ username: req.body.username }, function(err, result) {
      if(result) {
        if(bcrypt.compareSync(req.body.password, result.password)) {
          res.cookie("user_id", result._id, { signed: true, maxAge: config.cookieMaxAge });
          res.cookie("auth_token", result.auth_token, { signed: true, maxAge: config.cookieMaxAge });
          res.send({ username: result.username });
        }
        else {
          res.status(400).send({ error: "Invalid username or password." });
        }
      }
      else {
        res.status(400).send({ error: "Username not found." });
      }
    });
  } 
  else {
    res.status(400).send({ error: "Missing username or password." });
  }
});

app.post("/auth/logout", function(req, res) {
  res.clearCookie("user_id");
  res.clearCookie("auth_token");
  res.send("Logged out.");
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
  if(req.body && req.body._id && req.body.name && req.body.author_id && req.body.cards) {
    Deck.findOneAndUpdate({ _id: ObjectID(req.body._id) }, {
      name: req.body.name,
      author_id: req.body.author_id,
      cards: req.body.cards
    }, function(err, result) {
      console.log(err);
      console.log(result);
      if(err) {
        res.status(400).send(err);
      }
      else {
        res.status(200);
      }
    });
  }
  else {
    res.status(400).send("Missing one or more deck attributes.");
  }
});

app.post("/decks", function(req, res, next) {
  if(req.body && req.body.name && req.body.author_id) {
    var newDeck = new Deck(req.body);
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
