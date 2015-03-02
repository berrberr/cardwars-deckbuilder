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
        "build/edit/:id": "editDeckBuild"
      }
    });

    var executeAction = function(action, arg) {
      CWApp.startSubApp("BuilderApp");
      action(arg);
      CWApp.execute("set:active:header", "contacts");
    };

    var API = {
      emptyBuild: function() {
        require(["apps/builder/list/list_controller"],
                function(ListController) {
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

    CWApp.on("contact:show", function(id) {
      CWApp.navigate("contacts/" + id);
      API.showContact(id);
    });

    CWApp.on("contact:edit", function(id) {
      CWApp.navigate("contacts/" + id + "/edit");
      API.editContact(id);
    });

    CWApp.addInitializer(function() {
      new BuilderAppRouter.Router({
        controller: API
      });
    });
  });

  return CWApp.BuilderAppRouter;
});
