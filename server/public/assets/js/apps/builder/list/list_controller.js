define(["app",
        "apps/builder/list/list_view",
        "apps/builder/new/new_view"],
      function(CWApp, ListView, NewView) {
  CWApp.module("BuilderApp.List", function(List, CWApp, 
          Backbone, Marionette, $, _) {
    List.Controller = {
      listDecks: function() {
        require(["entities/deck"], function() {
          var fetchingDecks = CWApp.request("deck:entities");

          $.when(fetchingDecks).done(function(decks) {
            var layoutView = new ListView.Layout();
            var deckListView = new ListView.Decks({ collection: decks });
            var newButtonsView = new NewView.ButtonsView();

            layoutView.on("show", function() {
              layoutView.deckRegion.show(deckListView);
              layoutView.newRegion.show(newButtonsView);
            });

            CWApp.mainRegion.show(layoutView);
          });
        });
      }
    };
  });

  return CWApp.BuilderApp.List.Controller;
});
