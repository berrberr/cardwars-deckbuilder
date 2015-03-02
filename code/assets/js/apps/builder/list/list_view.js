define(["app",
        "tpl!apps/builder/list/templates/list.tpl",
        "tpl!apps/builder/list/templates/list_item.tpl",
        "tpl!apps/builder/list/templates/layout.tpl"],
      function(CWApp, listTpl, listItemTpl, layoutTpl) {
  CWApp.module("BuilderApp.List", function(List, CWApp, 
          Backbone, Marionette, $, _) {

    List.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        deckRegion: "#deck-region",
        newRegion: "#new-region"
      }
    });

    List.Deck = Marionette.ItemView.extend({
      template: listItemTpl,
      tagName: "tr"
    });

    List.Decks = Marionette.CompositeView.extend({
      template: listTpl,
      tagName: "table",
      childView: List.Deck,
      childViewContainer: "tbody"
    });
  });

  return CWApp.BuilderApp.List;
});
