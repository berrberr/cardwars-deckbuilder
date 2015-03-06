define(["app", "apps/builder/edit/edit_view"], function(CWApp, EditView) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {
    Edit.Controller = {
      editDeck: function(id) {
        require(["backbone.obscura", "entities/deck", "entities/card"], function(Obscura) {
          var fetchingDeck = CWApp.request("deck:entity", id);

          $.when(fetchingDeck).done(function(deck) {
            console.log(deck.get("cards"));
            var fetchingCards = CWApp.request("card:entities");
            $.when(fetchingCards).done(function(cards) {
              var filteredCards = new Obscura(cards);
              var deckCardsCollection = new Backbone.Collection(deck.get("cards").map(function(cardId) {
                return cards.findWhere({ _id: cardId }).toJSON();
              }));
              filteredCards.setPerPage(2);

              var layoutView = new EditView.Layout();
              var deckListView = new EditView.DeckList({ collection: deckCardsCollection });
              var cardListView = new EditView.CardList({ collection: filteredCards });

              layoutView.on("show", function() {
                layoutView.cardsRegion.show(cardListView);
                layoutView.deckRegion.show(deckListView);
              });

              cardListView.on("childview:deck:card:add", function(childView) {
                deckCardsCollection.add(childView.model.toJSON());
              });

              deckListView.on("childview:deck:card:remove", function(childView) {
                deckCardsCollection.remove(childView.model);
              });

              deckListView.on("deck:save", function() {
                deck.set("cards", deckCardsCollection.toJSON());
                deck.save();
                console.log(deck);
              });

              cardListView.on("cards:color:reset", function() {
                filteredCards.resetFilters();
              });

              cardListView.on("cards:color:change", function(filterColor) {
                filteredCards.filterBy({ color: filterColor });
              });

              cardListView.on("cards:page:next", function() {
                filteredCards.nextPage();
              });

              cardListView.on("cards:page:previous", function() {
                filteredCards.prevPage();
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
