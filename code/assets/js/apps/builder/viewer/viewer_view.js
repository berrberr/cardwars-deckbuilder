define(["app",
        "common/views",
        "apps/builder/common/views",
        "tpl!apps/builder/viewer/templates/list.tpl",
        "tpl!apps/builder/viewer/templates/list_item.tpl",
        "tpl!apps/builder/viewer/templates/deck_layout.tpl",
        "tpl!apps/builder/viewer/templates/deck.tpl",
        "tpl!apps/builder/viewer/templates/user_edit.tpl"],
function(CWApp, CommonViews, BuilderViews, listTpl, listItemTpl, deckLayoutTpl, deckTpl, userEditTpl) {
  CWApp.module("BuilderApp.Viewer.View", function(View, CWApp, 
    Backbone, Marionette, $, _) {

    View.DeckLayout = Marionette.LayoutView.extend({
      template: deckLayoutTpl,

      regions: {
        deckRegion: "#deck-region",
        authRegion: "#auth-region"
      },

      onChildviewUserEdit: function(childView) {
        this.trigger("user:edit", childView);
      }
    });

    View.UserEdit = Marionette.ItemView.extend({
      template: userEditTpl,

      triggers: {
        "click #btn-user-edit": "user:edit"
      }
    });

    View.MissingDeck = CommonViews.MissingDeck;

    View.DeckListItem = BuilderViews.DeckListItem.extend({
      editable: false
    });

    View.Deck = Marionette.CompositeView.extend({
      template: deckTpl,
      childView: BuilderViews.DeckListItem,
      childViewContainer: "#cards",

      initialize: function() {
        console.log(this.model);
        console.log(this.collection);
      }
    });

    View.DeckItem = Marionette.ItemView.extend({
      template: listItemTpl,
      tagName: "tr",

      triggers: {
        "click a.js-deck": "view:deck",
        "click a.js-user": "view:user"
      }
    });

    View.Decks = Marionette.CompositeView.extend({
      template: listTpl,
      tagName: "table",
      childView: View.DeckItem,
      childViewContainer: "tbody"
    });
  });

  return CWApp.BuilderApp.Viewer.View;
});
