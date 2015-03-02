define(["app",
        "tpl!apps/contacts/common/templates/contact_form.tpl",
        "backbone.syphon"],
      function(ContactManager, contactFormTpl) {
  ContactManager.module("ContactsApp.Common.Views", function(Views, ContactManager,
  Backbone, Marionette, $, _) {
    Views.Form = Marionette.ItemView.extend({
      template: contactFormTpl,

      events: {
        "click button.js-submit": "submitClicked"
      },

      submitClicked: function(e) {
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        this.trigger("form:submit", data);
      },

      onFormDataInvalid: function(errors) {
        var $view = this.$el;

        var clearFormErrors = function() {
          var $form = $view.find("form");
          $form.find(".help-block").each(function() {
            $(this).remove();
          });
          $form.find(".has-error").each(function() {
            $(this).removeClass("has-error");
          });
        };

        var markErrors = function(value, key) {
          var $controlGroup = $view.find("#contact-" + key).parent();
          var $errorEl = $("<span>", {class: "help-block", text: value});
          $controlGroup.append($errorEl).addClass("has-error");
        };

        clearFormErrors();
        _.each(errors, markErrors);
      }
    });
  });

  return ContactManager.ContactsApp.Common.Views;
});
