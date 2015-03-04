define(["app", "backbone", "jquery", "underscore"], function(CWApp, Backbone, $, _) {

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
      if(color === "All") return this.models;

      return this.where({ color: color });
    }
  });

  var API = {
    getCardEntities: function() {
      var cards = new Entities.CardCollection();
      var defer = $.Deferred();
      cards.fetch({
        success: function(cards) {
          // var colorSeperatedCards = {
          //   All: cards,
          //   BluePlains: new Backbone.Collection(cards.where({ color: "Blue Plains" })),
          //   Cornfield: new Backbone.Collection(cards.where({ color: "Cornfield" })),
          //   NiceLands: cards.where({ color: "NiceLands" }),
          //   Rainbow: cards.where({ color: "Rainbow" }),
          //   SandyLands: cards.where({ color: "SandyLands" }),
          //   UselessSwamp: cards.where({ color: "Useless Swamp" })
          // };
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
