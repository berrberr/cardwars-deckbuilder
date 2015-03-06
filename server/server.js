var express = require("express");
var app = express(),
    path = require("path"),
    bodyParser = require("body-parser"),
    mongo = require("mongoskin");

ObjectID = mongo.ObjectID;

var db = mongo.db("mongodb://@localhost:27017/cardwars");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.get("/decks/:id?", function(req, res) {
  if(req.params.id) {
    db.collection("decks").findById(req.params.id, function(err, result) {
      console.log(result);
      res.send(result);
    });
  }
  else {
    db.collection("decks").find().toArray(function(err, result) {
      res.send(result);
    });
  }
});

app.put("/decks/:id", function(req, res) {
  console.log(req.body);
  if(req.body && req.body._id && req.body.name && req.body.author_id && req.body.cards) {
    db.collection("decks").update({ _id: ObjectID(req.body._id) }, {
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
    console.log("*****DECK ERROR ******");
    res.status(400).send("Missing one or more deck attributes.");
  }
});

app.post("/decks", function(req, res, next) {
  if(req.body && req.body.name && req.body.author_id) {
    console.log(req.body);
    db.collection("decks").insert(req.body, function(err, result) {
      console.log(err);
      console.log(result[0]);
      res.send((err === null) ? result[0] : { error : err });
    });
  }
  else {
    res.status(400).send("Authorid or name required.");
  }
});

app.get("/cards/:id?", function(req, res) {
  if(req.params.id) {
    db.collection("cards").findById(req.params.id, function(err, result) {
      console.log(result);
      res.send(result);
    });
  }
  else {
    db.collection("cards").find().toArray(function(err, result) {
      res.send(result);
    });
  }
});

app.get("/batchcards", function(req, res) {
  if(req.query.ids) {
    var ids = req.query.ids.split(",");
    ids = ids.map(function(id) { return ObjectID(id); });
    db.collection("cards").find({ _id: { "$in": ids } }).toArray(function(err, result) {
      res.send(result);
    });
  }
  else {
    res.status(400).send("Item ids required.");
  }
});

//app.listen(3000);
module.exports = app;
