define(["app", "localstorage"], function(ContactManager) {
  ContactManager.module("Entities", function(Entities, ContactManager,
  Backbone, Marionette, $, _){
    var findStorageKey = function(entity) {
      // _.result returns the function result value (if function)
      if(entity.urlRoot) return _.result(entity, "urlRoot");
      if(entity.url) return _.result(entity, "url");

      // fallback to get model's storae key from parent collection
      if(entity.collection && entity.collection.url) return _.result(entity.collection, "url");

      throw new Error("Unable to determine storage key");
    };

    var StorageMixin = function(entityPrototype) {
      var storageKey = findStorageKey(entityPrototype);
      return { localStorage: new Backbone.LocalStorage(storageKey) };
    };

    Entities.configureStorage = function(entity) {
      _.extend(entity.prototype, new StorageMixin(entity.prototype));
    };
  });

  return ContactManager.Entities.configureStorage;
});
