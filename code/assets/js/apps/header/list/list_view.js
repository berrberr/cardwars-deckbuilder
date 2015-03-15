define(["app",
        "tpl!apps/header/list/templates/list.tpl",
        "tpl!apps/header/list/templates/list_item.tpl",
        "tpl!apps/header/list/templates/user_item.tpl",
        "bootstrap"],
function(CWApp, listTpl, listItemTpl, userItemTpl) {
  CWApp.module("HeaderApp.List.View", function(View, CWApp,
    Backbone, Marionette, $, _) {

    View.HeaderLayout = Marionette.LayoutView.extend({
      template: listTpl,

      regions: {
        linksRegion: "#list-region",
        userRegion: "#user-region"
      },

      events: {
        "click a.brand": "brandClicked"
      },

      brandClicked: function(e) {
        e.preventDefault();
        this.trigger("brand:clicked");
      }
    });

    View.Header = Marionette.ItemView.extend({
      template: listItemTpl,
      tagName: "li",

      events: {
        "click a": "navigate"
      },

      navigate: function(e) {
        e.preventDefault();
        this.trigger("navigate", this.model);
      },

      onRender: function() {
        if(this.model.selected) {
          // add class so Bootstrap will highlight the active entry in the navbar
          this.$el.addClass("active");
        }
      }
    });

    View.Headers = Marionette.CollectionView.extend({
      childView: View.Header,
      tagName: "ul",
      className: "nav navbar-nav"
    });

    View.User = Marionette.ItemView.extend({
      template: userItemTpl,
      tagName: "li",

      events: {
        "click a": "userClicked"
      },

      modelEvents: {
        "change": "render"
      },

      userClicked: function() {
        CWApp.trigger("user:profile", this.model);
      }
    });
  });

  return CWApp.HeaderApp.List.View;
});
