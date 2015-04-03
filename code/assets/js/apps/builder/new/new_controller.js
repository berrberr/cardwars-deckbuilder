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

          CWApp.activeSession.checkAuth({
            success: function() {
              newDeck.save(null, {
                success: function() {
                  CWApp.trigger("build:deck:edit", newDeck.id);
                },
                error: function() {
                  console.log("Something went wrong!");
                }
              });
            },
            error: function() {
              CWApp.activeSession.cacheDeck(newDeck);
              CWApp.trigger("build:deck:edit:guest", newDeck);
            }
          });
        });
      }
    };
  });

  return CWApp.BuilderApp.New.Controller;
});
