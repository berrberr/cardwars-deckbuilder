define(["app", "backbone", "jquery", "underscore"], function(CWApp, Backbone, $) {

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
    model: Entities.Card
  });

  var API = {
    getCardEntities: function() {
      var cards = new Entities.CardCollection();
      var defer = $.Deferred();
      cards.fetch({
        success: function(data) {
          defer.resolve(data);
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
    }
  };

  CWApp.reqres.setHandler("card:entities", function() {
    return API.getCardEntities();
  });

  CWApp.reqres.setHandler("card:entity", function(cardId) {
    return API.getCardEntity(cardId);
  });

  return Entities;
});
