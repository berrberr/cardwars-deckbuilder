define(["app"], function(CWApp) {
  CWApp.module("BuilderApp.New", function(New, CWApp, 
          Backbone, Marionette, $, _) {
    New.Controller = {
      newDeckBuild: function() {
        require(["entities/deck"], function() {
          var newDeck = CWApp.request("deck:entity:new");
          newDeck.set({ name: "Untitled Deck", author_id: "1234" });
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
