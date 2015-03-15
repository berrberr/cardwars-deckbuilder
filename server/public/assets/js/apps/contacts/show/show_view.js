define(["app",
        "tpl!apps/contacts/show/templates/missing_contact.tpl",
        "tpl!apps/contacts/show/templates/contact.tpl"],
function(ContactManager, missingContactTpl, contactTpl) {
  ContactManager.module("ContactsApp.Show", function(Show, ContactManager,
  Backbone, Marionette, $, _) {
    Show.MissingContact = Marionette.ItemView.extend({
      template: missingContactTpl
    });

    Show.Contact = Marionette.ItemView.extend({
      template: contactTpl,

      events: {
        "click a.js-back": "listContactsClicked",
        "click a.js-edit": "editClicked"
      },

      listContactsClicked: function(e) {
        e.preventDefault();
        ContactManager.trigger("contacts:list");
      },

      editClicked: function(e) {
        e.preventDefault();
        this.trigger("contact:edit", this.model);
      }
    });
  });

  return ContactManager.ContactsApp.Show;
});
