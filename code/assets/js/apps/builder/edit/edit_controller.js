define(["app", "apps/builder/edit/edit_view"], function(CWApp, EditView) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {
    var showEditDeck = function(deck) {
      require(["backbone.obscura", "entities/deck", "entities/card"], function(Obscura) {
        var fetchingCards = CWApp.request("card:entities");
        $.when(fetchingCards).done(function(cards) {
          console.log(deck);
          var filteredCards = new Obscura(cards);
          var deckCardsCollection = CWApp.request("deck:card:entities", cards, deck.get("cards"));
          filteredCards.setPerPage(4);

          /** Main layout **/
          var layoutView = new EditView.Layout();

          /** Decklist **/
          var deckListView = new EditView.DeckList({ model: deck, collection: deckCardsCollection });

          /** Cardlist layout **/
          var cardLayoutView = new EditView.CardLayout();
          var cardListView = new EditView.CardList({ collection: filteredCards });

          /** Landscape/hero div **/
          var landscapeHeroLayout = new EditView.LandscapeHeroLayout();
          var selectedHero = deck.get("heroes").findWhere({ _id: deck.get("hero") });
          selectedHero = selectedHero || CWApp.request("hero:entity:new");
          var heroesView = new EditView.Heroes({
            model: selectedHero,
            collection: deck.get("heroes")
          });
          var landscapeView = new EditView.Landscapes({
            model: new Backbone.Model({ "landscapes": deck.get("landscapes") })
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
            landscapeHeroLayout.landscapeRegion.show(landscapeView);
            landscapeHeroLayout.heroesRegion.show(heroesView);
          });

          landscapeView.on("landscape:change", function(val) {
            var landscapes = deck.get("landscapes");
            if(val.id && landscapes[parseInt(val.id)]) {
              landscapes[parseInt(val.id)] = val.landscape;
              deck.set("landscapes", landscapes);

              // Save deck on landscape select change
              deckListView.trigger("deck:save");
            }
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
      });
    };

    Edit.Controller = {
      editDeck: function(id) {
        require(["entities/deck", "entities/card"], function() {
          // Fetch the deck
          var fetchingDeck = CWApp.request("deck:entity", id);
          $.when(fetchingDeck).done(function(deck) {
            console.log(deck);
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
      },
      guestEditDeck: function(deck) {
        showEditDeck(deck);
      }
    };
  });

  return CWApp.BuilderApp.Edit.Controller;
});
