define(["marionette", "apps/config/marionette/regions/dialog"], function(Marionette) {

  /**
   * GLOBALS
   */
  var CWApp = new Marionette.Application();
  CWApp.API = "";

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
    require(["entities/common",
              "apps/builder/builder_app",
              "apps/user/user_app"],
            function(CommonEntities) {
      CWApp.activeSession = new CommonEntities.Session();
      // Check cookies for logged in user and set active user if found
      CWApp.activeSession.checkAuth();

      if(Backbone.history) {
        Backbone.history.start();

        // Root route
        if(CWApp.getCurrentRoute() === "") {
          CWApp.trigger("build:deck:list");
        }
      }
    });
  });

  return CWApp;
});
