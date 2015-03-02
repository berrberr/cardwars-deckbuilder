define(["marionette", "apps/config/marionette/regions/dialog"], function(Marionette) {
  var CWApp = new Marionette.Application();

  CWApp.addRegions({
    headerRegion: "#header-region",
    mainRegion: "#main-region",
    bottomRegion: "#bottom-region",
    dialogRegion: Marionette.Region.Dialog.extend({
      el: "#dialog-region"
    })
  });

  CWApp.navigate = function(route, options) {
    options = options || {};
    Backbone.history.navigate(route, options);
  };

  CWApp.getCurrentRoute = function() {
    return Backbone.history.fragment;
  };

  CWApp.startSubApp = function(appName, args) {
    var currentApp = appName ? CWApp.module(appName) : null;
    if(CWApp.currentApp === currentApp){ return ; }

    if(CWApp.currentApp) {
      CWApp.currentApp.stop();
    }

    CWApp.currentApp = currentApp;
    if(currentApp) {
      currentApp.start(args);
    }
  };

  CWApp.on("start", function() {
    require(["apps/builder/builder_app"], function() {
      if(Backbone.history) {
        Backbone.history.start();

        // Root route
        if(CWApp.getCurrentRoute() === "") {
          CWApp.trigger("contacts:list");
        }
      }
    });
  });

  return CWApp;
});
