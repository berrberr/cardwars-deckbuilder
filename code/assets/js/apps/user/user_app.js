define(["app"], function(CWApp) {
  CWApp.module("UserApp", function(UserApp, CWApp, 
          Backbone, Marionette, $, _) {

    UserApp.startWithParent = false;

    UserApp.onStart = function() {
      console.log("Starting UserApp");
    };

    UserApp.onStop = function() {
      console.log("Stopping UserApp");
    };
  });

  CWApp.module("Router.UserApp", function(UserAppRouter, 
          CWApp, Backbone, Marionette, $, _) {

    UserAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login": "loginForm",
        "signup": "signupForm",
        "user/:username": "userProfile",
        "profile/:username": "publicProfile"
      }
    });

    var executeAction = function(action, args) {
      CWApp.startSubApp("UserApp");
      action(args);
      CWApp.execute("set:active:header", null);
    };

    var API = {
      loginForm: function() {
        require(["apps/user/login/login_controller"], function(LoginController) {
          executeAction(LoginController.showLogin);
        });
      },
      signupForm: function() {
        require(["apps/user/login/login_controller"], function(LoginController) {
          executeAction(LoginController.showSignup);
        });
      },
      userProfile: function(userModel) {
        require(["apps/user/profile/profile_controller"], function(ProfileController) {
          if(userModel instanceof Backbone.Model) {
            executeAction(ProfileController.show, { user: userModel });
          }
          // We have come from the URL route
          else {
            var model = CWApp.activeSession.user;
            if(model.get("username") === userModel) {
              executeAction(ProfileController.show, { user: model });
            }
            else {
              executeAction(ProfileController.show, { user: null });
            }
          }
        });
      },
      publicProfile: function(username) {
        require(["apps/user/profile/profile_controller", "entities/common"], function(ProfileController, CommonEntities) {
          var user = new CommonEntities.User({ username: username });
          console.log(user);
          user.fetch({
            success: function(result) {
              executeAction(ProfileController.show, { user: result, isPublic: true });
            },
            error: function() {
              executeAction(ProfileController.show, { user: null, isPublic: true });
            }
          });
        });
      }
    };
    
    CWApp.on("user:login:show", function() {
      CWApp.navigate("login");
      API.loginForm();
    });

    CWApp.on("user:signup:show", function() {
      CWApp.navigate("signup");
      API.signupForm();
    });

    CWApp.on("user:profile", function(userModel) {
      if(userModel && userModel.has("username")) {
        CWApp.navigate("user/" + userModel.get("username"));
        API.userProfile(userModel);
      }
      else {
        CWApp.trigger("user:login:show");
      }
    });

    CWApp.on("user:public:profile", function(username) {
      API.publicProfile(username);
    });

    CWApp.addInitializer(function() {
      new UserAppRouter.Router({
        controller: API
      });
    });
  });

  return CWApp.UserAppRouter;
});
