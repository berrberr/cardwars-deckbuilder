define(["app", "apps/builder/edit/edit_view"], function(CWApp, EditView) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {
    Edit.Controller = {
      editDeck: function(id) {
        require(["backbone.obscura", "entities/deck", "entities/card"], function(Obscura) {
          var showEditDeck = function(deck) {
            var fetchingCards = CWApp.request("card:entities");
            $.when(fetchingCards).done(function(cards) {
              var filteredCards = new Obscura(cards);
              var deckCardsCollection = CWApp.request("deck:card:entities", cards, deck.get("cards"));
              filteredCards.setPerPage(4);

              var layoutView = new EditView.Layout();
              var cardLayoutView = new EditView.CardLayout();
              var deckListView = new EditView.DeckList({ model: deck, collection: deckCardsCollection });
              var cardListView = new EditView.CardList({ collection: filteredCards });
              var landscapeHeroLayout = new EditView.LandscapeHeroLayout();
              var selectedHero = deck.get("heroes").findWhere({ _id: deck.get("hero") });
              selectedHero = selectedHero || CWApp.request("hero:entity:new");
              var heroesView = new EditView.Heroes({
                model: selectedHero,
                collection: deck.get("heroes")
              });

              layoutView.on("show", function() {
                layoutView.cardsRegion.show(cardLayoutView);
                layoutView.deckRegion.show(deckListView);
              });

              cardLayoutView.on("show", function() {
                cardLayoutView.cardListRegion.show(cardListView);
                cardLayoutView.landscapeRegion.show(landscapeHeroLayout);
              });

              landscapeHeroLayout.on("show", function() {
                landscapeHeroLayout.landscapeRegion.show(new EditView.Landscapes(
                  new Backbone.Model({ "landscapes": deck.get("landscapes") })));
                landscapeHeroLayout.heroesRegion.show(heroesView);
              });

              heroesView.on("childview:hero:set", function(childView) {
                deck.set("hero", childView.model.id);

                // Update the selected hero which will update the view
                var newHero = deck.get("heroes").findWhere({ _id: deck.get("hero") });
                selectedHero.set(newHero.toJSON());
                heroesView.heroChange();

                // Trigger a deck save on hero change
                deckListView.trigger("deck:save");
              });

              deckListView.on("deck:save", function() {
                CWApp.activeSession.checkAuth({
                  success: function(result) {
                    console.log("saving...");
                    deck.set("cards", deckCardsCollection.toJSON());
                    deck.save(null, {
                      success: function() {
                        deckListView.flash("Deck saved!", "alert-success");
                      },
                      error: function() {
                        deckListView.flash("Problem saving deck. Please try again", "alert-danger");
                      }
                    });
                  },
                  error: function(error) {
                    deckListView.flash("You must be logged in to save a deck.", "alert-warning");
                  }
                });
                console.log(deck);
              });

              deckListView.on("deck:name:update", function(newName) {
                deck.set("name", newName);

                // Trigger a deck save on title change
                deckListView.trigger("deck:save");

              });

              cardListView.on("childview:deck:card:add", function(childView) {
                deckCardsCollection.add(childView.model.toJSON());
              });

              deckListView.on("childview:deck:card:remove", function(childView) {
                deckCardsCollection.remove(childView.model);
              });

              cardListView.on("cards:color:reset", function() {
                filteredCards.resetFilters();
                filteredCards.setPage(0);
              });

              cardListView.on("cards:color:change", function(filterColor) {
                filteredCards.filterBy({ color: filterColor });
                filteredCards.setPage(0);
              });

              cardListView.on("cards:page:next", function() {
                filteredCards.nextPage();
              });

              cardListView.on("cards:page:previous", function() {
                filteredCards.prevPage();
              });

              CWApp.mainRegion.show(layoutView);
            });
          };

          // Fetch the deck
          var fetchingDeck = CWApp.request("deck:entity", id);
          $.when(fetchingDeck).done(function(deck) {
            console.log(deck.get("cards"));
            // If author is the default value then we are editing deck as guest
            if(deck.get("author") === deck.defaults.author) {
              showEditDeck(deck);
            }
            // otherwise we have to validate the current user vs deck author
            else {
              CWApp.activeSession.checkAuth({
                success: function(user) {
                  if(user.username === deck.get("author")) {
                    showEditDeck(deck);
                  }
                  else {
                    CWApp.trigger("view:deck:model", deck);
                  }
                },
                error: function() {
                  CWApp.trigger("view:deck:model", deck);
                }
              });
            }
          });
        });
      }
    };
  });

  return CWApp.BuilderApp.Edit.Controller;
});
