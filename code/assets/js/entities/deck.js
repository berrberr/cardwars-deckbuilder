define(["app", "backbone", "jquery", "underscore"], function(CWApp, Backbone, $, _) {

  // All deck related entities
  var Entities = {};

  Entities.Deck = Backbone.Model.extend({
    urlRoot: CWApp.API + "/decks",
    idAttribute: "_id",

    defaults: {
      name: "New Deck",
      author: "Guest",
      description: "",
      hero: "",
      landscapes: ["blueplains", "cornfield", "uselessswamp", "sandylands"],
      cards: []
    },

    fetchSubresource: function(opts) {
      var defer = $.Deferred();
      var self = this;
      var url = this.urlRoot + "/" + opts.path + "/" + opts.param;
      $.get(url)
        .done(function(result) {
          self.set(result);
          defer.resolve(self);
        })
        .fail(function() {
          defer.reject(undefined);
        });

      return defer.promise();
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
    model: Entities.Deck,

    fetchSubresource: function(opts) {
      var defer = $.Deferred();
      var self = this;
      var resourceUrl = this.url + "/" + opts.path + "/" + opts.param;
      $.get(resourceUrl)
        .done(function(result) {
          self.reset(result);
          defer.resolve(self);
        })
        .fail(function() {
          defer.reject(undefined);
        });

      return defer.promise();
    }
  });

  Entities.Hero = Backbone.Model.extend({
    urlRoot: CWApp.API + "/heroes",
    idAttribute: "_id",

    defaults: {
      name: "",
      image: ""
    }
  });

  Entities.HeroCollection = Backbone.Collection.extend({
    url: CWApp.API + "/heroes",
    model: Entities.Hero
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
      var heroes = new Entities.HeroCollection();
      var defer = $.Deferred();
      deck.fetch({
        success: function(data) {
          heroes.fetch({
            success: function(heroData) {
              data.set("heroes", heroData);
              defer.resolve(data);
            }
          });
        },
        error: function() {
          defer.resolve(undefined);
        }
      });

      return defer.promise();
    },

    getDecksSubresource: function(opts) {
      var decks = new Entities.DeckCollection();
      var defer = $.Deferred();
      $.when(decks.fetchSubresource(opts))
        .done(function(data) {
          defer.resolve(data);
        })
        .fail(function() {
          defer.resolve(undefined);
        });

      return defer.promise();
    },

    getDeckSubresource: function(opts) {
      var deck = new Entities.Deck();
      var defer = $.Deferred();
      $.when(deck.fetchSubresource(opts))
        .done(function(data) {
          defer.resolve(data);
        })
        .fail(function() {
          defer.resolve(undefined);
        });

      return defer.promise();
    },

    getHeroEntities: function() {
      var heroes = new Entities.HeroCollection();
      var defer = $.Deferred();
      heroes.fetch({
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

  CWApp.reqres.setHandler("deck:entities:user", function(username) {
    return API.getDecksSubresource({ path: "author", param: username });
  });

  CWApp.reqres.setHandler("deck:entity", function(deckId) {
    return API.getDeckEntity(deckId);
  });

  CWApp.reqres.setHandler("deck:entity:slug", function(slug) {
    return API.getDeckSubresource({ path: "slug", param: slug });
  });

  CWApp.reqres.setHandler("hero:entities", function() {
    return API.getHeroEntities();
  });

  CWApp.reqres.setHandler("hero:entity:new", function() {
    return new Entities.Hero();
  });

  return Entities;
});
