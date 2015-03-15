define(["app", "apps/header/list/list_controller"], function(CWApp, ListController){
  CWApp.module("HeaderApp", function(Header, CWApp, Backbone, Marionette, $, _){
    
    var API = {
      listHeader: function(){
        ListController.listHeader();
      }
    };

    CWApp.commands.setHandler("set:active:header", function(name){
      ListController.setActiveHeader(name);
    });

    Header.on("start", function(){
      API.listHeader();
    });
  });

  return CWApp.HeaderApp;
});
