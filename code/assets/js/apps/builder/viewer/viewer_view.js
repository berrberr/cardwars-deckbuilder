define(["app",
        "tpl!apps/builder/viewer/templates/list.tpl",
        "tpl!apps/builder/viewer/templates/list_item.tpl",
        "tpl!apps/builder/viewer/templates/deck_layout.tpl",
        "tpl!apps/builder/viewer/templates/deck.tpl"],
      function(CWApp, listTpl, listItemTpl, deckLayoutTpl, deckTpl) {
  CWApp.module("BuilderApp.Viewer.View", function(View, CWApp, 
          Backbone, Marionette, $, _) {

    View.DeckLayout = Marionette.LayoutView.extend({
      template: deckLayoutTpl,

      regions: {
        deckRegion: "#deck-region"
      }
    });

    View.Deck = Marionette.CompositeView.extend({
      template: deckTpl
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
