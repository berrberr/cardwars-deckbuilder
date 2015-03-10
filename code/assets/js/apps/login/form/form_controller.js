define(["app", "apps/login/form/form_view"], function(CWApp, FormView) {
  CWApp.module("LoginApp.Form", function(Form, CWApp,
          Backbone, Marionette, $, _) {

    Form.Controller = {
      show: function() {
        var formView = new FormView.View();

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

        CWApp.mainRegion.show(formView);
      }
    };
  });

  return CWApp.LoginApp.Form.Controller;
});
