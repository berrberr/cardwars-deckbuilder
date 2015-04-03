define(["app"], function(CWApp) {
  CWApp.module("BuilderApp", function(BuilderApp, CWApp, 
          Backbone, Marionette, $, _) {

    BuilderApp.startWithParent = false;

    BuilderApp.onStart = function() {
      console.log("Starting builderapp");
    };

    BuilderApp.onStop = function() {
      console.log("Stopping builderapp");
    };
  });

  CWApp.module("Router.BuilderApp", function(BuilderAppRouter, 
          CWApp, Backbone, Marionette, $, _) {

    BuilderAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "build": "emptyBuild",
        "build/new": "newDeckBuild",
        "build/edit/guest": "guestEditDeck",
        "build/edit/:id": "editDeckBuild",
        "view(/)": "viewDeck",
        "view/:slug": "viewDeck"
      }
    });

    var executeAction = function(action, arg) {
      CWApp.startSubApp("BuilderApp");
      action(arg);
      if(arg && arg.header) {
        CWApp.execute("set:active:header", arg.header);
      }
      else {
        CWApp.execute("set:active:header", "build");
      }
    };

    var API = {
      emptyBuild: function() {
        require(["apps/builder/list/list_controller"], function(ListController) {
          executeAction(ListController.listDecks);
        });
      },
      newDeckBuild: function() {
        require(["apps/builder/new/new_controller"], function(NewController) {
          executeAction(NewController.newDeckBuild);
        });
      },
      editDeckBuild: function(id) {
        require(["apps/builder/edit/edit_controller"], function(EditController) {
          executeAction(EditController.editDeck, id);
        });
      },
      guestEditDeck: function(deck) {
        require(["apps/builder/edit/edit_controller", "entities/deck"], function(EditController) {
          var fetchingHeroes = CWApp.request("hero:entities");
          $.when(fetchingHeroes).done(function(heroes) {
            console.log("fetched heroes: ", heroes);
            if(deck) {
              deck.set("heroes", heroes);
              executeAction(EditController.guestEditDeck, deck);
            }
            else {
              $.when(CWApp.activeSession.getCachedDeck()).done(function(cachedDeck) {
                cachedDeck.set("heroes", heroes);
                executeAction(EditController.guestEditDeck, cachedDeck);
              });
            }
          });
        });
      },
      viewDeck: function(slug) {
        require(["apps/builder/viewer/viewer_controller"], function(ViewerController) {
          if(slug) {
            executeAction(ViewerController.showDeck, { slug: slug, header: "view" });
          }
          else {
            executeAction(ViewerController.showDecks, { header: "view" });
          }
        });
      },
      viewDeckModel: function(deck) {
        require(["apps/builder/viewer/viewer_controller"], function(ViewerController) {
          executeAction(ViewerController.showDeck, { model: deck, header: "view" });
        });
      }
    };

    CWApp.on("build:deck:new", function() {
      CWApp.navigate("build/new");
      API.newDeckBuild();
    });

    CWApp.on("build:deck:edit", function(id) {
      CWApp.navigate("build/edit/" + id);
      API.editDeckBuild(id);
    });

    CWApp.on("build:deck:edit:guest", function(deck) {
      CWApp.navigate("build/edit/guest");
      API.guestEditDeck(deck);
    });

    CWApp.on("build:deck:list", function() {
      CWApp.navigate("build");
      API.emptyBuild();
    });

    CWApp.on("view:deck:list", function() {
      CWApp.navigate("view");
      API.viewDeck();
    });

    CWApp.on("view:deck:model", function(deck) {
      console.log(deck);
      CWApp.navigate("view/" + deck.get("slug"));
      API.viewDeckModel(deck);
    });

    CWApp.addInitializer(function() {
      new BuilderAppRouter.Router({
        controller: API
      });
    });
  });

  return CWApp.BuilderAppRouter;
});
