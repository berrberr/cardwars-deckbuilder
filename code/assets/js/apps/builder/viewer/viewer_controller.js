define(["app", "apps/builder/viewer/viewer_view"], function(CWApp, ViewerView) {
  CWApp.module("BuilderApp.Viewer", function(Viewer, CWApp, 
          Backbone, Marionette, $, _) {
    Viewer.Controller = {
      showDecks: function() {
        require(["backbone.obscura", "entities/deck", "entities/card"], function(Obscura) {
          var fetchingDecks = CWApp.request("deck:entities");

          $.when(fetchingDecks).done(function(decks) {
            var decksView = new ViewerView.Decks({ collection: decks });

            decksView.on("childview:view:deck", function(childView) {
              CWApp.trigger("view:deck:model", childView.model);
            });

            decksView.on("childview:view:user", function(childView) {
              CWApp.trigger("user:public:profile", childView.model.get("author"));
            });

            CWApp.mainRegion.show(decksView);
          });

        });
      },
      showDeck: function(opts) {
        require(["entities/deck", "entities/card"], function() {
          var showDeckModel = function(deck) {
            var fetchingCards = CWApp.request("card:entities");
            $.when(fetchingCards).done(function(cards) {
              var deckLayout = new ViewerView.DeckLayout();
              var isAuth = false;

              if(deck) {
                var deckCardsCollection = CWApp.request("deck:card:entities", cards, deck.get("cards"));
                isAuth = CWApp.activeSession.has("username") ?
                  (CWApp.activeSession.get("username") === deck.get("author")) : false;
                var deckList = new ViewerView.Deck({
                  model: deck,
                  collection: deckCardsCollection
                });
                console.log(deck);
              }
              
              deckLayout.on("show", function() {
                if(deck) {
                  deckLayout.deckRegion.show(deckList);
                }
                else {
                  deckLayout.deckRegion.show(new ViewerView.MissingDeck());
                }

                if(isAuth) {
                  deckLayout.authRegion.show(new ViewerView.UserEdit());
                  deckLayout.on("user:edit", function(childView) {
                    CWApp.trigger("build:deck:edit", deck.id);
                  });
                }
              });

              CWApp.mainRegion.show(deckLayout);
            });
          };

          if(opts.model) {
            showDeckModel(opts.model);
          }
          else if(opts.slug) {
            var fetchingDeck = CWApp.request("deck:entity:slug", opts.slug);
            $.when(fetchingDeck).done(function(deck) {
              showDeckModel(deck);
            });
          }
        });
      }
    };
  });

  return CWApp.BuilderApp.Viewer.Controller;
});
