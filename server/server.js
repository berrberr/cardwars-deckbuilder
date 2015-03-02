var express = require("express");
var app = express(),
    path = require("path"),
    bodyParser = require("body-parser"),
    mongo = require("mongoskin");

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
    console.log("Missing name or author_id: ", req.body);
    res.sendStatus(400);
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

//app.listen(3000);
module.exports = app;
