define(["app", "apps/builder/viewer/viewer_view"], function(CWApp, ViewerView) {
  CWApp.module("BuilderApp.Viewer", function(Viewer, CWApp, 
          Backbone, Marionette, $, _) {
    Viewer.Controller = {
      showDecks: function() {

      },
      showDeck: function(slug) {
        require(["backbone.obscura", "entities/deck", "entities/card"], function(Obscura) {
        });
      }
    };
  });

  return CWApp.BuilderApp.Viewer.Controller;
});
