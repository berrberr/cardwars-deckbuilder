define(["app", "apps/builder/edit/edit_view"], function(CWApp, EditView) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {
    Edit.Controller = {
      editDeck: function(id) {
        require(["entities/deck", "entities/card"], function() {
          var fetchingDeck = CWApp.request("deck:entity", id);

          $.when(fetchingDeck).done(function(deck) {
            var fetchingCards = CWApp.request("card:entities");
            $.when(fetchingCards).done(function(cards) {
              var layoutView = new EditView.Layout();
              var cardListView = new EditView.CardList({ collection: cards.clone() });
              console.log(cardListView);

              layoutView.on("show", function() {
                layoutView.cardsRegion.show(cardListView);
              });
              
              cardListView.on("color:change", function(color) {
                // cardListView = new EditView.CardList({ collection: cards.byColor(color) });
                // layoutView.cardsRegion.show(cardListView);
                console.log("cchange", cards.byColor(color));
                console.log(cards);
                cardListView.collection.reset(cards.byColor(color));

                //cardListView.collection.set(cards.color);
                //cardListView.render();
                // layoutView.cardsRegion.show(cardListView);
                // cardListView.render();
              });

              CWApp.mainRegion.show(layoutView);
            });
          });
        });
      }
    };
  });

  return CWApp.BuilderApp.Edit.Controller;
});
