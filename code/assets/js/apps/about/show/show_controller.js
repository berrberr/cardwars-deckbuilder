define(["app", "apps/about/show/show_view"], function(ContactManager, ShowView) {
  return {
    showAbout: function() {
      var view = new ShowView.Message();
      ContactManager.mainRegion.show(view);
    }
  };
});
