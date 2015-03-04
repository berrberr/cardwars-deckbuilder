define(["app",
        "tpl!apps/builder/edit/templates/layout.tpl",
        "tpl!apps/builder/edit/templates/card_list.tpl",
        "tpl!apps/builder/edit/templates/card.tpl"],
      function(CWApp, layoutTpl, cardListTpl, cardTpl) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {

    Edit.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        cardsRegion: "#cards-region",
        deckRegion: "#deck-region"
      }
    });

    Edit.Card = Marionette.ItemView.extend({
      template: cardTpl,

      tagName: "td"
    });

    Edit.CardList = Marionette.CompositeView.extend({
      template: cardListTpl,
      childView: Edit.Card,
      childViewContainer: "tbody",

      events: {
        "click #colors a": "colorChange"
      },

      colorChange: function(e) {
        e.preventDefault();
        console.log("color change called", e.target);
        this.trigger("color:change", e.target.getAttribute("data-color"));
      },

      attachHtml: function(collectionView, childView, index) {
        if(index !== 0 && index % 2 === 0) {
          collectionView.$el.find("tr:last").after("<tr></tr>");
        }
        var lastRow = collectionView.$el.find("tr:last");
        lastRow.append(childView.el);
      },

      onRender: function() {
        console.log("were rendering", this.collection);
      }

    });
  });

  return CWApp.BuilderApp.Edit;
});
