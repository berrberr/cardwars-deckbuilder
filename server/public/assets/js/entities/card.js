define(["app",
        "entities/common",
        "backbone",
        "jquery",
        "underscore"],
      function(CWApp, CommonEntities, Backbone, $, _) {

  // All deck related entities
  var Entities = {};

  Entities.Card = Backbone.Model.extend({
    urlRoot: CWApp.API + "/cards",
    idAttribute: "_id",

    defaults: {
      name: "",
      cost: "",
      color: "",
      type: "",
      atk: "",
      def: "",
      ability: "",
      image: "",
      text: "",
      quantity: ""
    },

    validate: function(attrs, options) {
      console.log(attrs.quantity);
      if(attrs.quantity > 3) {
        console.log("qty too big", attrs.quantity);
        return "maximum 3 cards in deck";
      }
    }
  });

  Entities.CardCollection = Backbone.Collection.extend({
    url: CWApp.API + "/cards",
    model: Entities.Card,

    byColor: function(color) {
      if(color === "All") return this.fullCollection.models;

      return this.fullCollection.where({ color: color });
    }
  });

  Entities.CardIdCollection = Backbone.Collection.extend({
    url: CWApp.API + "/batchcards",
    model: Entities.Card,

    initialize: function(model, options) {
      this.idArr = options.ids;
    },

    fetchCards: function() {
      var baseUrl = this.url;
      var defer = $.Deferred();

      this.url += "?ids=" + this.idArr.join(",");
      this.fetch().done(function(res) {
        console.log(res);
        defer.resolve(res);
      });

      this.url = baseUrl;
      return defer.promise();
    }
  });

  Entities.DeckCardCollection = Backbone.Collection.extend({
    model: Entities.Card,

    initFromArray: function(options) {
      var that = this;
      _.each(options.cardIds, function(cardId) {
        that.add(options.cards.findWhere({ _id: cardId }).toJSON());
      });
    },

    add: function(model, options) {
      options = _.extend(options ? options : {}, { merge: true, validate: true });
      var card = this.findWhere({ _id: model._id });
      console.log("card: ", card);
      if(card) {
        model.quantity = card.get("quantity") + 1;
      }
      else {
        model.quantity = 1;
      }
      Backbone.Collection.prototype.add.call(this, model, options);
    },

    remove: function(model, options) {
      options = _.extend(options ? options : {}, { merge: true, validate: true });
      var card = this.findWhere({ _id: model.get("_id") });
      console.log(card.get("quantity"));
      if(card && card.get("quantity") > 1) {
        card.set("quantity", card.get("quantity") - 1);
      }
      else {
        Backbone.Collection.prototype.remove.call(this, model, options);
      }
    }
  });

  var API = {
    getCardEntities: function() {
      var cards = new Entities.CardCollection();
      var defer = $.Deferred();
      cards.fetch({
        success: function(cards) {
          defer.resolve(cards);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });

      return defer.promise();
    },

    getCardEntity: function(cardId) {
      var card = new Entities.Deck({ _id: cardId });
      var defer = $.Deferred();
      card.fetch({
        success: function(data) {
          defer.resolve(data);
        },
        error: function() {
          defer.resolve(undefined);
        }
      });

      return defer.promise();
    },

    getDeckCardEntities: function(cards, cardIds) {
      var deckCardCollection = new Entities.DeckCardCollection();
      deckCardCollection.initFromArray({ cards: cards, cardIds: cardIds });
      return deckCardCollection;
    }
  };

  CWApp.reqres.setHandler("card:entities", function() {
    return API.getCardEntities();
  });

  CWApp.reqres.setHandler("card:entity", function(cardId) {
    return API.getCardEntity(cardId);
  });

  CWApp.reqres.setHandler("deck:card:entities", function(cards, cardIds) {
    return API.getDeckCardEntities(cards, cardIds);
  });

  return Entities;
});
