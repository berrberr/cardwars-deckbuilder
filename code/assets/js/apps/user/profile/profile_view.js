define(["app",
        "tpl!apps/user/profile/templates/profile.tpl",
        "tpl!apps/user/profile/templates/empty.tpl",
        "tpl!apps/user/profile/templates/logged_out.tpl",
        "backbone.syphon"],
      function(CWApp, profileTpl, emptyTpl, loggedOutTpl) {
  CWApp.module("UserApp.Profile.View", function(View, CWApp,
          Backbone, Marionette, $, _){

    View.Profile = Marionette.ItemView.extend({
      template: profileTpl,

      triggers: {
        "click #btn-logout": "user:active:logout"
      }
    });

    View.Empty = Marionette.ItemView.extend({
      template: emptyTpl
    });

    View.LoggedOut = Marionette.ItemView.extend({
      template: loggedOutTpl
    });
  });

  return CWApp.UserApp.Profile.View;
});
