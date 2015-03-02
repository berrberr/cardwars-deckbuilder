define(["app", "apps/contacts/edit/edit_view"], function(ContactManager, EditView) {
  ContactManager.module("ContactsApp.Edit", function(Edit, ContactManager,
  Backbone, Marionette, $, _){
    Edit.Controller = {
      editContact: function(id) {
        require(["common/views", "apps/contacts/show/show_view", "entities/contact"], function(CommonViews, ShowView) {
          var loadingView = new CommonViews.Loading({
            title: "Artifical Loading Delay",
            message: "Data loading is delayed by 2 seconds."
          });
          ContactManager.mainRegion.show(loadingView);

          var fetchingContact = ContactManager.request("contact:entity", id);
          $.when(fetchingContact).done(function(contact) {
            var view;
            if(typeof contact !== "undefined") {
              view = new EditView.Contact({
                model: contact,
                generateTitle: true
              });

              view.on("form:submit", function(data) {
                if(contact.save(data)) {
                  ContactManager.trigger("contact:show", contact.get("id"));
                } else {
                  view.triggerMethod("form:data:invalid", contact.validationError);
                }
              });
            } else {
              view = new ShowView.MissingContact();
            }

            ContactManager.mainRegion.show(view);
          });
        });
      }
    };
  });

  return ContactManager.ContactsApp.Edit.Controller;
});
