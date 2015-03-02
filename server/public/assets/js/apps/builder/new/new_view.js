define(["app",
        "tpl!apps/builder/new/templates/newButtons.tpl"],
      function(CWApp, newButtonsTpl) {
  CWApp.module("BuilderApp.New", function(New, CWApp, 
          Backbone, Marionette, $, _) {
    New.ButtonsView = Marionette.ItemView.extend({
      template: newButtonsTpl,

      events: {
        "click #btn-new": "triggerNewDeck"
      },

      triggerNewDeck: function() {
        CWApp.trigger("build:deck:new");
      }
    });
  });

  return CWApp.BuilderApp.New;
});
