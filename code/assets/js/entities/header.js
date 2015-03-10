define(["app", "backbone.picky"], function(CWApp){
  CWApp.module("Entities", function(Entities, CWApp, Backbone, Marionette, $, _){
    Entities.Header = Backbone.Model.extend({
      initialize: function(){
        var selectable = new Backbone.Picky.Selectable(this);
        _.extend(this, selectable);
      }
    });

    Entities.HeaderCollection = Backbone.Collection.extend({
      model: Entities.Header,

      initialize: function(){
        var singleSelect = new Backbone.Picky.SingleSelect(this);
        _.extend(this, singleSelect);
      }
    });

    var initializeHeaders = function(){
      Entities.headers = new Entities.HeaderCollection([
        { name: "Build", url: "build", navigationTrigger: "build:deck:list" },
        { name: "Login", url: "login", navigationTrigger: "login:show" }
      ]);
    };

    var API = {
      getHeaders: function(){
        if(Entities.headers === undefined){
          initializeHeaders();
        }
        return Entities.headers;
      }
    };

    CWApp.reqres.setHandler("header:entities", function(){
      return API.getHeaders();
    });
  });

  return ;
});
