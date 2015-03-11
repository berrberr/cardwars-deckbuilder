define(["app",
        "tpl!apps/builder/edit/templates/layout.tpl"],
      function(CWApp, layoutTpl) {
  CWApp.module("BuilderApp.Viewer.View", function(View, CWApp, 
          Backbone, Marionette, $, _) {

    View.List = Marionette.CompositeView.extend({
      template: listTpl
    });
  });

  return CWApp.BuilderApp.Viewer.View;
});
