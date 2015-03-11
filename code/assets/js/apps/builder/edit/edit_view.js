define(["app",
        "tpl!apps/builder/edit/templates/layout.tpl",
        "tpl!apps/builder/edit/templates/card_list.tpl",
        "tpl!apps/builder/edit/templates/card.tpl",
        "tpl!apps/builder/edit/templates/deck_list.tpl",
        "tpl!apps/builder/edit/templates/deck_list_item.tpl"],
      function(CWApp, layoutTpl, cardListTpl, cardTpl, deckListTpl, deckListItemTpl) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {

    Edit.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        cardsRegion: "#cards-region",
        deckRegion: "#deck-region"
      }
    });

    Edit.Card = Marionette.ItemView.extend({
      template: cardTpl,
      tagName: "td",

      triggers: {
        "click img": "deck:card:add"
      }
    });

    Edit.CardList = Marionette.CompositeView.extend({
      template: cardListTpl,
      childView: Edit.Card,
      childViewContainer: "tbody",

      triggers: {
        "click #next-page": "cards:page:next",
        "click #previous-page": "cards:page:previous"
      },

      events: {
        "click #colors a": "colorChange"
      },

      colorChange: function(e) {
        e.preventDefault();
        if(e.target.getAttribute("data-color") === "All") {
          this.trigger("cards:color:reset");
        }
        else {
          this.trigger("cards:color:change", e.target.getAttribute("data-color"));
        }
      },

      attachHtml: function(collectionView, childView, index) {
        if(index !== 0 && index % 2 === 0) {
          collectionView.$el.find("tr:last").after("<tr></tr>");
        }
        var lastRow = collectionView.$el.find("tr:last");
        lastRow.append(childView.el);
      },

      onRender: function() {
        console.log("were rendering", this.collection);
      }

    });

    Edit.DeckListItem = Marionette.ItemView.extend({
      template: deckListItemTpl,
      tagName: "li",

      triggers: {
        "click span.remove": "deck:card:remove"
      },

      modelEvents: {
        "change": "render"
      }
    });

    Edit.DeckList = Marionette.CompositeView.extend({
      template: deckListTpl,
      childView: Edit.DeckListItem,
      childViewContainer: "ul",

      ui: {
        deckName: "#deck-name",
        deckNameInput: "#deck-name-edit",
        flash: "#flash"
      },

      modelEvents: {
        "change": "render"
      },

      events: {
        "click @ui.deckName": "editName",
        "blur @ui.deckNameInput": "updateName",
        "keypress @ui.deckNameInput": "keypressUpdateName"
      },

      triggers: {
        "click #save-deck": "deck:save"
      },

      editName: function() {
        var inputLength = this.ui.deckNameInput.val().length * 2;
        this.ui.deckName.hide();
        this.ui.deckNameInput.show();
        this.ui.deckNameInput.focus();
        this.ui.deckNameInput[0].setSelectionRange(inputLength, inputLength);
      },

      keypressUpdateName: function(e) {
        if(e.which === 13) this.updateName();
      },

      updateName: function() {
        this.ui.deckName.show();
        this.ui.deckNameInput.hide();
        this.trigger("deck:name:update", this.ui.deckNameInput.val());
      },

      flash: function(message, style) {
        this.ui.flash.removeClass("hidden").addClass(style).text(message);
      }
    });
  });

  return CWApp.BuilderApp.Edit;
});
