define(["app", "apps/builder/edit/edit_view"], function(CWApp) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {
    Edit.Controller = {
      editDeck: function(id) {
        require(["entities/deck", "entities/card"], function() {
          var fetchingDeck = CWApp.request("deck:entity", id);

          $.when(fetchingDeck).done(function(deck) {
            var fetchingCards = CWApp.request("card:entities");
            $.when(fetchingCards).done(function(cards) {
              console.log(deck);
              console.log(cards);
            });
          });
        });
      }
    };
  });

  return CWApp.BuilderApp.Edit.Controller;
});
