define(["app",
        "tpl!common/templates/loading.tpl",
        "tpl!common/templates/404.tpl",
        "tpl!common/templates/missing_deck.tpl",
        "spin.jquery"],
function(CWApp, loadingTpl, missingPageTpl, missingDeckTpl) {
  CWApp.module("Common.Views", function(Views, CWApp,
  Backbone, Marionette, $, _) {

    Views.MissingPage = Marionette.ItemView.extend({
      template: missingPageTpl
    });

    Views.MissingDeck = Marionette.ItemView.extend({
      template: missingDeckTpl
    });

    Views.Loading = Marionette.ItemView.extend({
      template: loadingTpl,

      title: "Loading Data",
      message: "Please wait, data is loading.",

      serializeData: function() {
        return {
          title: Marionette.getOption(this, "title"),
          message: Marionette.getOption(this, "message")
        };
      },

      onShow: function() {
        var opts = {
          lines: 13,
          length: 20,
          width: 10,
          radius: 30,
          corners: 1,
          rotate: 0,
          direction: 1,
          color: "#000",
          speed: 1,
          trail: 60,
          shadow: false,
          hwaccel: false,
          className: "spinner",
          zIndex: 2e9,
          top: "30px",
          left: "auto"
        };
        $("#spinner").spin(opts);
      }
    });
  });

  return CWApp.Common.Views;
});
