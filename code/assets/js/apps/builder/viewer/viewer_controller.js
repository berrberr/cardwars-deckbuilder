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
              console.log(childView.model);
              CWApp.trigger("view:deck:model", childView.model.toJSON());
            });
            // layoutView.on("show", function() {
            //   layoutView.deckRegion.show(deckListView);
            //   layoutView.newRegion.show(newButtonsView);
            // });

            CWApp.mainRegion.show(decksView);
          });

        });
      },
      showDeck: function(opts) {
        var showDeckModel = function(model) {
          console.log(model);
          var deckLayout = new ViewerView.DeckLayout();

          deckLayout.on("show", function() {
            deckLayout.deckRegion.show(new ViewerView.Deck(model));
          });

          CWApp.mainRegion.show(deckLayout);
        };

        require(["entities/deck"], function() {
          if(opts.model) {
            showDeckModel(opts.model);
          }
          else {

          }
        });
      }
    };
  });

  return CWApp.BuilderApp.Viewer.Controller;
});
