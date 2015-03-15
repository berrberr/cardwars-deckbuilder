define(["app",
        "common/views",
        "apps/builder/common/views",
        "tpl!apps/builder/viewer/templates/list.tpl",
        "tpl!apps/builder/viewer/templates/list_item.tpl",
        "tpl!apps/builder/viewer/templates/deck_layout.tpl",
        "tpl!apps/builder/viewer/templates/deck.tpl",
        "tpl!apps/builder/viewer/templates/deck_list_item.tpl"],
function(CWApp, CommonViews, BuilderViews, listTpl, listItemTpl, deckLayoutTpl, deckTpl, deckListItemTpl) {
  CWApp.module("BuilderApp.Viewer.View", function(View, CWApp, 
    Backbone, Marionette, $, _) {

    View.DeckLayout = Marionette.LayoutView.extend({
      template: deckLayoutTpl,

      regions: {
        deckRegion: "#deck-region"
      }
    });

    View.MissingDeck = CommonViews.MissingDeck;

    View.DeckListItem = BuilderViews.DeckListItem.extend({
      editable: false
    });

    View.Deck = Marionette.CompositeView.extend({
      template: deckTpl,
      childView: BuilderViews.DeckListItem,
      childViewContainer: "#cards",

      initialize: function() {
        console.log(this.model);
        console.log(this.collection);
      }
    });

    View.DeckItem = Marionette.ItemView.extend({
      template: listItemTpl,
      tagName: "tr",

      triggers: {
        "click a": "view:deck"
      }
    });

    View.Decks = Marionette.CompositeView.extend({
      template: listTpl,
      tagName: "table",
      childView: View.DeckItem,
      childViewContainer: "tbody"
    });
  });

  return CWApp.BuilderApp.Viewer.View;
});
