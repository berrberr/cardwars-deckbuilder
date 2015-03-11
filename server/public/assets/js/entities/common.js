define(["app", "backbone", "jquery", "underscore"], function(CWApp, Backbone, $, _) {

  var Entities = {};
  
  Entities.User = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: CWApp.API + "/user",

    defaults: {
      username: null
    }
  });

  Entities.Session = Backbone.Model.extend({
    urlRoot: CWApp.API + "/auth",

    defaults: {
      loggedIn: false,
      username: null
    },

    initialize: function() {
      this.user = new Entities.User({});
    },

    updateUser: function(userData) {
      this.user.set(_.pick(userData, _.keys(this.user.defaults)));
    },

    checkAuth: function(callback, args) {
      var self = this;
      callback = callback || {};
      this.fetch({
        success: function(model, result) {
          if(result && !result.error) {
            self.updateUser(result);
            self.set("loggedIn", true);
            if("success" in callback) callback.success(model, result);
          }
          else {
            if("error" in callback) callback.error(model, result);
          }
        },
        error: function(model, result) {
          self.set({ loggedIn: false });
            if("error" in callback) callback.error(model, result);
        }
      }).complete(function() {
        if("complete" in callback) callback.complete();
      });
    },

    postAuth: function(opts, callback, args) {
      var self = this;
      var postData = _.omit(opts, "method");
      callback = callback || {};
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
              self.set({ username: result.username, loggedIn: true });
            }
            else if(_.indexOf(["logout"], opts.method) !== -1) {
              self.set({ loggedIn: false });
              self.user.clear();
            }
            else {
              self.set({ loggedIn: false });
            }
            if(callback && "success" in callback) callback.success(result);
          }
          else {
            if(callback && "error" in callback) callback.error(result);
          }
        },
        error: function(error) {
          if(callback && "error" in callback) callback.error(error.responseJSON);
        }
      }).complete(function(result) {
        if(callback && "complete" in callback) callback.complete(result);
      });
    },

    login: function(opts, callback, args) {
      this.postAuth(_.extend(opts, { method: "login" }), callback, args);
    },

    logout: function(opts, callback, args) {
      this.postAuth(_.extend(opts, { method: "logout" }), callback, args);
    },

    signup: function(opts, callback, args) {
      this.postAuth(_.extend(opts, { method: "signup" }), callback, args);
    }

  });

  return Entities;
});
