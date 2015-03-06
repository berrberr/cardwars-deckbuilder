define(["app",
        "entities/common",
        "backbone",
        "jquery",
        "underscore"],
      function(CWApp, CommonEntities, Backbone, $, _) {

  // All deck related entities
  var Entities = {};

  Entities.Card = Backbone.Model.extend({
    urlRoot: "cards",
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
      text: ""
    }
  });

  Entities.CardCollection = Backbone.Collection.extend({
    url: "cards",
    model: Entities.Card,

    byColor: function(color) {
      if(color === "All") return this.fullCollection.models;

      return this.fullCollection.where({ color: color });
    }
  });

  Entities.CardIdCollection = Backbone.Collection.extend({
    url: "batchcards",
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

    getDeckCardEntities: function(cardIdArr) {
      var cards = new Entities.CardIdCollection({}, { ids: cardIdArr });
      var defer = $.Deferred();
      $.when(cards.fetchCards()).done(function() {
        defer.resolve(cards);
      });
      return defer.promise();
    }
  };

  CWApp.reqres.setHandler("card:entities", function() {
    return API.getCardEntities();
  });

  CWApp.reqres.setHandler("card:entity", function(cardId) {
    return API.getCardEntity(cardId);
  });

  CWApp.reqres.setHandler("deck:card:entities", function(cardIdArr) {
    return API.getDeckCardEntities(cardIdArr);
  });

  return Entities;
});
