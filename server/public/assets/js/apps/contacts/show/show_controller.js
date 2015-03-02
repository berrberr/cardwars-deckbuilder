define(["app", "apps/contacts/show/show_view"], function(ContactManager, ShowView) {
  ContactManager.module("ContactsApp.Show", function(Show, ContactManager,
  Backbone, Marionette, $, _) {
    Show.Controller = {
      showContact: function(id) {
        require(["common/views", "entities/contact"], function(CommonViews) {
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading delayed by 2 seconds"
          });
          ContactManager.mainRegion.show(loadingView);

          var fetchingContact = ContactManager.request("contact:entity", id);
          $.when(fetchingContact).done(function(contact) {
            var contactView;
            if(typeof contact !== "undefined") {
              contactView = new ShowView.Contact({
                model: contact
              });

              contactView.on("contact:edit", function(contact) {
                ContactManager.trigger("contact:edit", contact.get("id"));
              });
            } else {
              contactView = new ShowView.MissingContact();
            }

            ContactManager.mainRegion.show(contactView);
          });
        });
      }
    };
  });

  return ContactManager.ContactsApp.Show.Controller;
});
