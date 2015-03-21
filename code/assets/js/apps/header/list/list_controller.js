define(["app", "apps/header/list/list_view"], function(CWApp, View){
  CWApp.module("HeaderApp.List", function(List, CWApp, Backbone, Marionette, $, _){
    
    List.Controller = {
      listHeader: function(){
        require(["entities/header"], function(){
          var links = CWApp.request("header:entities");
          var headerLayout = new View.HeaderLayout();
          var headerItems = new View.Headers({
            collection: links,
            username: null
          });

          headerLayout.on("show", function() {
            headerLayout.linksRegion.show(headerItems);
            headerLayout.userRegion.show(new View.User({
              model: CWApp.activeSession.user
            }));
          });

          headerLayout.on("brand:clicked", function() {
            CWApp.trigger("build:deck:list");
          });

          headerItems.on("childview:navigate", function(childView, model){
            var trigger = model.get("navigationTrigger");
            CWApp.trigger(trigger);
          });

          CWApp.headerRegion.show(headerLayout);
        });
      },

      setActiveHeader: function(headerUrl) {
        var links = CWApp.request("header:entities");
        var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
        links.selectNone();
        if(headerToSelect) {
          headerToSelect.select();
        }
        links.trigger("reset");
      }
    };
  });

  return CWApp.HeaderApp.List.Controller;
});
