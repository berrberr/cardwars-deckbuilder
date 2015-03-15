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

    serializeData: function () {
      return _.extend(this.model.toJSON(), { editable: Marionette.getOption(this, "editable") });
    }
  });

  return Views;
});
