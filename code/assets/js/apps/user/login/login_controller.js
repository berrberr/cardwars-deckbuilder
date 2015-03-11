define(["app", "apps/user/login/login_view"], function(CWApp, LoginView) {
  CWApp.module("UserApp.Login", function(Login, CWApp,
          Backbone, Marionette, $, _) {

    Login.Controller = {
      showLogin: function() {
        var formView = new LoginView.Login();

        formView.on("form:submit", function(data) {
          CWApp.activeSession.login(data, {
            success: function(result) {
              CWApp.trigger("build:deck:list");
            },
            error: function(error) {
              formView.showLoginError();
            }
          });
        });

        formView.on("user:signup", function() {
          CWApp.trigger("user:signup:show");
        });

        CWApp.mainRegion.show(formView);
      },

      showSignup: function() {
        var signupView = new LoginView.Signup();

        signupView.on("form:submit", function(data) {
          CWApp.activeSession.signup(data, {
            success: function() {
              CWApp.trigger("user:profile", CWApp.activeSession.user);
            },
            error: function(err) {
              console.log(err);
              signupView.showSignupError(err);
            }
          });
        });

        CWApp.mainRegion.show(signupView);
      }
    };
  });

  return CWApp.UserApp.Login.Controller;
});
