define(["app",
        "apps/contacts/list/list_view"],
function(ContactManager, View) {
  ContactManager.module("ContactsApp.List", function(List, ContactManager,
  Backbone, Marionette, $, _) {
    List.Controller = {
      listContacts: function(criterion) {
        require(["common/views", "entities/contact", "entities/common"], function(CommonViews) {
          var loadingView = new CommonViews.Loading();
          ContactManager.mainRegion.show(loadingView);

          var fetchingContacts = ContactManager.request("contact:entities");

          var contactsListLayout = new View.Layout();
          var contactsListPanel = new View.Panel();

          $.when(fetchingContacts).done(function(contacts) {
            var filteredContacts = ContactManager.Entities.FilteredCollection({
              collection: contacts,

              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(contact) {
                  if(contact.get("firstName").toLowerCase().indexOf(criterion) !== -1 ||
                    contact.get("lastName").toLowerCase().indexOf(criterion) !== -1 ||
                    contact.get("phoneNumber").toLowerCase().indexOf(criterion) !== -1) {
                    return contact;
                  }
                };
              }
            });

            if(criterion) {
              filteredContacts.filter(criterion);
              contactsListPanel.once("show", function() {
                contactsListPanel.triggerMethod("set:filter:criterion", criterion);
              });
            }

            var contactsListView = new View.Contacts({
              collection: filteredContacts
            });

            contactsListLayout.on("show", function() {
              contactsListLayout.panelRegion.show(contactsListPanel);
              contactsListLayout.contactsRegion.show(contactsListView);
            });

            contactsListPanel.on("contacts:filter", function(filterCriterion) {
              filteredContacts.filter(filterCriterion);
              ContactManager.trigger("contacts:filter", filterCriterion);
            });

            contactsListPanel.on("contact:new", function() {
              require(["apps/contacts/new/new_view"], function(NewView) {
                var newContact = ContactManager.request("contact:entity:new");

                var view = new NewView.Contact({
                  model: newContact
                });

                view.on("form:submit", function(data) {
                  if(contacts.length > 0) {
                    var highestId = contacts.max(function(c) { return c.id; }).get("id");
                    data.id = highestId + 1;
                  } else {
                    data.id = 1;
                  }

                  if(newContact.save(data)) {
                    contacts.add(newContact);
                    view.trigger("dialog:close");
                    var newContactView = contactsListView.children.findByModel(newContact);
                    if(newContactView) {
                      newContactView.flash("success");
                    }
                  } else {
                    view.triggerMethod("form:data:invalid", newContact.validationError);
                  }
                });

                ContactManager.dialogRegion.show(view);
              });
            });

            contactsListView.on("childview:contact:show", function(childView, args) {
              ContactManager.trigger("contact:show", args.model.get("id"));
            });

            contactsListView.on("childview:contact:edit", function(childView, args) {
              require(["apps/contacts/edit/edit_view"], function(EditView) {
                var model = args.model;
                var view = new EditView.Contact({
                  model: model
                });

                view.on("form:submit", function(data) {
                  if(model.save(data)) {
                    childView.render();
                    view.trigger("dialog:close");
                    childView.flash("success");
                  } else {
                    view.triggerMethod("form:data:invalid", model.validationError);
                  }
                });

                ContactManager.dialogRegion.show(view);
              });
            });

            contactsListView.on("childview:contact:delete", function(childView, args) {
              args.model.destroy();
            });

            contactsListView.on("childview:contact:logInfo", function(childView, model) {
              console.log("Highlighting toggled on: ", model);
            });

            ContactManager.mainRegion.show(contactsListLayout);
          });
        });
      }
    };
  });

  return ContactManager.ContactsApp.List.Controller;
});
