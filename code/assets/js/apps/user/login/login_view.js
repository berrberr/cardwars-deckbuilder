define(["app",
        "tpl!apps/user/login/templates/login_form.tpl",
        "tpl!apps/user/login/templates/signup_form.tpl",
        "backbone.syphon"],
      function(CWApp, loginFormTpl, signupFormTpl) {
  CWApp.module("UserApp.Login.View", function(View, CWApp,
          Backbone, Marionette, $, _){

    View.Login = Marionette.ItemView.extend({
      template: loginFormTpl,

      events: {
        "click #btn-submit": "submitClicked",
        "click #btn-signup": "signupClicked"
      },

      ui: {
        loginError: "#login-error"
      },

      submitClicked: function(e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        this.trigger("form:submit", data);
      },

      signupClicked: function(e) {
        e.preventDefault();
        this.trigger("user:signup");
      },

      showLoginError: function() {
        this.ui.loginError.removeClass("hidden");
      }
    });

    View.Signup = Marionette.ItemView.extend({
      template: signupFormTpl,

      events: {
        "click #btn-submit": "submitClicked"
      },

      ui: {
        inlineSignupError: "#inline-signup-error",
        signupError: "#signup-error",
        signupForm: "#signup-form"
      },

      submitClicked: function(e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        this.trigger("form:submit", data);
      },

      showSignupError: function(err) {
        if(err && err.stayOnPage) {
          this.ui.inlineSignupError.removeClass("hidden");
          this.ui.inlineSignupError.text(err.error);
        }
        else {
          this.ui.signupError.removeClass("hidden");
          this.ui.signupForm.addClass("hidden");
        }
      }
    });
  });

  return CWApp.UserApp.Login.View;
});
