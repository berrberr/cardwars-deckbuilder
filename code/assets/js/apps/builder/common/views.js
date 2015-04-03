define(["app",
        "marionette",
        "underscore",
        "tpl!apps/builder/common/templates/card.tpl",
        "tpl!apps/builder/common/templates/deck_list_item.tpl"],
function(CWApp, Marionette, _, cardTpl, deckListItemTpl) {

  var Views = {};

  Views.Card = Marionette.ItemView.extend({
    template: cardTpl,
    tagName: "td"
  });

  Views.DeckListItem = Marionette.ItemView.extend({
    template: deckListItemTpl,
    tagName: "li",

    ui: {
      cardHover: ".deck-item-card-hover"
    },

    events: {
      "mouseenter": "showCard",
      "mouseleave": "hideCard",
      "mousemove": "moveCard"
    },

    showCard: function(e) {
      this.ui.cardHover
        .addClass("active")
        .css({
          top: e.clientY,
          left: e.clientX - 400
        });
    },

    moveCard: function(e) {
      this.ui.cardHover.css({
        top: e.clientY,
        left: e.clientX - 400
      });
    },

    hideCard: function() {
      this.ui.cardHover.removeClass("active");
    },

    attributes: function() {
      return {
        "class": "deck-item " + this.model.get("color").toLowerCase().replace(" ", "")
      };
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), { editable: Marionette.getOption(this, "editable") });
    }
  });

  return Views;
});
