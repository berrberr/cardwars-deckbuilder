define(["app",
        "tpl!apps/user/profile/templates/profile.tpl",
        "tpl!apps/user/profile/templates/empty.tpl",
        "tpl!apps/user/profile/templates/logged_out.tpl",
        "tpl!apps/user/profile/templates/layout.tpl",
        "tpl!apps/user/profile/templates/deck.tpl",
        "tpl!apps/user/profile/templates/deck_list.tpl",
        "backbone.syphon"],
function(CWApp, profileTpl, emptyTpl, loggedOutTpl, layoutTpl, deckTpl, deckListTpl) {
  CWApp.module("UserApp.Profile.View", function(View, CWApp,
          Backbone, Marionette, $, _){

    View.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        "userInfoRegion": "#user-info-region",
        "deckRegion": "#deck-region"
      }
    });

    View.UserInfo = Marionette.ItemView.extend({
      template: profileTpl,

      triggers: {
        "click #btn-logout": "user:active:logout"
      }
    });

    View.Deck = Marionette.ItemView.extend({
      template: deckTpl,
      tagName: "li",

      triggers: {
        "click a": "deck:view"
      }
    });

    View.Decks = Marionette.CollectionView.extend({
      template: deckListTpl,
      childView: View.Deck,
      childViewContainer: "ul"
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
