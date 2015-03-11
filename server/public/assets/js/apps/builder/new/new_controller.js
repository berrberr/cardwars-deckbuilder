define(["app"], function(CWApp) {
  CWApp.module("BuilderApp.New", function(New, CWApp, 
          Backbone, Marionette, $, _) {
    New.Controller = {
      newDeckBuild: function() {
        require(["entities/deck"], function() {
          var newDeck = CWApp.request("deck:entity:new");
          var author = CWApp.activeSession.get("loggedIn") ?
            CWApp.activeSession.get("username") : "Guest";
          newDeck.set({ name: "Untitled Deck", author: author });
          console.log(newDeck);
          newDeck.save(null, {
            success: function() {
              CWApp.trigger("build:deck:edit", newDeck.id);
            },
            error: function() {
              console.log("Something went wrong!");
            }
          });
        });
      }
    };
  });

  return CWApp.BuilderApp.New.Controller;
});
