define(["app", "apps/user/profile/profile_view"], function(CWApp, ProfileView) {
  CWApp.module("UserApp.Profile", function(Profile, CWApp,
          Backbone, Marionette, $, _) {

    Profile.Controller = {
      show: function(userModel, public) {
        if(userModel && userModel.has("username")) {
          require(["entities/deck"], function() {
            var fetchingDecks = CWApp.request("deck:entities:user", userModel.get("username"));
            $.when(fetchingDecks).done(function(decks) {
              console.log(decks);
              var profileLayout = new ProfileView.Layout();
              var decksView = new ProfileView.Decks({ collection: decks });
              var userInfoView;

              if(public) {
                userInfoView = new ProfileView.PublicUserInfo({ model: userModel });
              }
              else {
                userInfoView = new ProfileView.UserInfo({ model: userModel });
                userInfoView.on("user:active:logout", function() {
                  CWApp.activeSession.logout({}, {
                    complete: function() {
                      CWApp.mainRegion.show(new ProfileView.LoggedOut());
                    }
                  });
                });
              }

              decksView.on("childview:deck:view", function(view) {
                CWApp.trigger("view:deck:model", view.model);
              });

              profileLayout.on("show", function() {
                profileLayout.userInfoRegion.show(userInfoView);
                profileLayout.deckRegion.show(decksView);
              });

              CWApp.mainRegion.show(profileLayout);
            });
          });
        }
        else {
          CWApp.mainRegion.show(new ProfileView.Empty());
        }
      }
    };
  });

  return CWApp.UserApp.Profile.Controller;
});
