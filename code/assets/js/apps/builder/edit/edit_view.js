define(["app",
        "tpl!apps/builder/edit/templates/layout.tpl",
        "tpl!apps/builder/edit/templates/card_list.tpl",
        "tpl!apps/builder/edit/templates/card.tpl"],
      function(CWApp, layoutTpl, cardTpl) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {
    Edit.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        cards: "#region-cards",
        deck: "#region-deck"
      }
    });

    Edit.CardView = Marionette.ItemView.extend({
      template: cardTpl,

      tagName: "tr"
    });

    Edit.CardListView = Marionette.CompositeView.extend({
      template: cardListTpl,
      childView: Edit.CardView,
      childViewContainer: "tbody"
    });
  });

  return CWApp.BuilderApp.Edit;
});
