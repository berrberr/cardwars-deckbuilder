define(["app", "backbone", "jquery", "underscore"], function(CWApp, Backbone, $, _) {

  // All deck related entities
  var Entities = {};

  Entities.Deck = Backbone.Model.extend({
    urlRoot: CWApp.API + "/decks",
    idAttribute: "_id",

    defaults: {
      name: "New Deck",
      author: "Guest",
      cards: []
    },

    sync: function(method) {
      console.log("deck sync called", method);
      if(method === "update") {
        var ids = [];
        _.each(this.get("cards"), function(card) {
          for(var i = 0; i < card.quantity; i++) {
            ids.push(card._id);
          }
        });
        this.set("cards", ids);
      }

      return Backbone.sync.apply(this, arguments);
    }
  });

  Entities.DeckCollection = Backbone.Collection.extend({
    url: CWApp.API + "/decks",
    model: Entities.Deck
  });

  var API = {
    getDeckEntities: function() {
      var decks = new Entities.DeckCollection();
      var defer = $.Deferred();
      decks.fetch({
        success: function(data) {
          defer.resolve(data);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });

      return defer.promise();
    },

    getDeckEntity: function(deckId) {
      var deck = new Entities.Deck({ _id: deckId });
      var defer = $.Deferred();
      deck.fetch({
        success: function(data) {
          defer.resolve(data);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });

      return defer.promise();
    }
  };

  CWApp.reqres.setHandler("deck:entity:new", function() {
    return new Entities.Deck();
  });

  CWApp.reqres.setHandler("deck:entities", function() {
    return API.getDeckEntities();
  });

  CWApp.reqres.setHandler("deck:entity", function(deckId) {
    return API.getDeckEntity(deckId);
  });

  return Entities;
});
