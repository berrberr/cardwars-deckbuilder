define(["app",
        "tpl!apps/login/form/templates/form.tpl",
        "backbone.syphon"],
      function(CWApp, formTpl) {
  CWApp.module("LoginApp.Form", function(Form, CWApp,
          Backbone, Marionette, $, _){

    Form.View = Marionette.ItemView.extend({
      template: formTpl,

      events: {
        "click button.js-submit": "submitClicked"
      },

      ui: {
        loginError: "#login-error"
      },

      submitClicked: function(e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        console.log(data);
        this.trigger("form:submit", data);
      },

      showLoginError: function() {
        this.ui.loginError.removeClass("hidden");
      },

      onFormDataInvalid: function(errors) {
        var $view = this.$el;

        var clearFormErrors = function() {
          var $form = $view.find("form");
          $form.find(".help-block").each(function() {
            $(this).remove();
          });
          $form.find(".has-error").each(function() {
            $(this).removeClass("has-error");
          });
        };

        var markErrors = function(value, key) {
          var $controlGroup = $view.find("#contact-" + key).parent();
          var $errorEl = $("<span>", {class: "help-block", text: value});
          $controlGroup.append($errorEl).addClass("has-error");
        };

        clearFormErrors();
        _.each(errors, markErrors);
      }
    });
  });

  return CWApp.LoginApp.Form;
});
