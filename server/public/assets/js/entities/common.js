define(["app", "backbone", "jquery", "underscore"], function(CWApp, Backbone, $, _) {

  var Entities = {};
  
  Entities.User = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: CWApp.API + "/user",

    defaults: {
      username: ""
    }
  });

  Entities.Session = Backbone.Model.extend({
    urlRoot: CWApp.API + "/auth",

    defaults: {
      loggedIn: false,
      username: ""
    },

    initialize: function() {
      this.user = new Entities.User({});
    },

    updateUser: function(userData) {
      this.user.set(_.pick(userData, _.keys(this.user.defaults)));
    },

    checkAuth: function(args) {
      var defer = $.Deferred();
      var self = this;
      this.fetch({
        success: function(model, result) {
          self.updateUser(result);
          self.set("loggedIn", true);
          defer.resolve(true);
        },
        error: function(model, result) {
          self.set({ loggedIn: false });
          defer.reject(result.responseText);
        }
      });

      return defer.promise();
    },

    postAuth: function(opts, callback, args) {
      var self = this;
      var postData = _.omit(opts, "method");
      $.ajax({
        url: this.url() + "/" + opts.method,
        contentType: "application/json",
        dataType: "json",
        type: "POST",
        data:  JSON.stringify( _.omit(opts, "method") ),
        success: function(result) {
          console.log(result);
          if(!result.error){
            if(_.indexOf(["login", "signup"], opts.method) !== -1) {
              self.updateUser(result || {});
              self.set({ username: result.username, logged_in: true });
            } else {
              self.set({ logged_in: false });
            }
            if(callback && "success" in callback) callback.success(result);
          } else {
            if(callback && "error" in callback) callback.error(result);
          }
        },
        error: function(model, result) {
          if(callback && "error" in callback) callback.error(result);
        }
      }).complete(function() {
        if(callback && "complete" in callback) callback.complete(result);
      });
    },

    login: function(opts, callback, args) {
      this.postAuth(_.extend(opts, { method: "login" }), callback, args);
    }

  });

  return Entities;
});
