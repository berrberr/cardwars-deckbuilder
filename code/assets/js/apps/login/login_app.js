define(["app"], function(CWApp) {
  CWApp.module("LoginApp", function(LoginApp, CWApp, 
          Backbone, Marionette, $, _) {

    LoginApp.startWithParent = false;

    LoginApp.onStart = function() {
      console.log("Starting LoginApp");
    };

    LoginApp.onStop = function() {
      console.log("Stopping LoginApp");
    };
  });

  CWApp.module("Router.LoginApp", function(LoginAppRouter, 
          CWApp, Backbone, Marionette, $, _) {

    LoginAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "login": "loginForm"
      }
    });

    var executeAction = function(action, arg) {
      CWApp.startSubApp("LoginApp");
      action(arg);
      CWApp.execute("set:active:header", "login");
    };

    var API = {
      loginForm: function() {
        require(["apps/login/form/form_controller"],
                function(LoginFormController) {
          executeAction(LoginFormController.show);
        });
      }
    };
    
    CWApp.on("login:show", function() {
      CWApp.navigate("login");
      API.loginForm();
    });

    CWApp.addInitializer(function() {
      new LoginAppRouter.Router({
        controller: API
      });
    });
  });

  return CWApp.LoginAppRouter;
});
