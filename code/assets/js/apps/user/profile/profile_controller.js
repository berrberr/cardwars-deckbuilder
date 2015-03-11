define(["app", "apps/user/profile/profile_view"], function(CWApp, ProfileView) {
  CWApp.module("UserApp.Profile", function(Profile, CWApp,
          Backbone, Marionette, $, _) {

    Profile.Controller = {
      show: function(userModel) {
        if(userModel && userModel.has("username")) {
          var profileView = new ProfileView.Profile({ model: userModel });

          profileView.on("user:active:logout", function() {
            CWApp.activeSession.logout({}, {
              complete: function() {
                CWApp.mainRegion.show(new ProfileView.LoggedOut());
              }
            });
          });

          CWApp.mainRegion.show(profileView);
        }
        else {
          CWApp.mainRegion.show(new ProfileView.Empty());
        }
      }
    };
  });

  return CWApp.UserApp.Profile.Controller;
});
