define(["app",
        "apps/builder/common/views",
        "tpl!apps/builder/edit/templates/layout.tpl",
        "tpl!apps/builder/edit/templates/card_list.tpl",
        "tpl!apps/builder/edit/templates/deck_list.tpl",
        "tpl!apps/builder/edit/templates/card_layout.tpl",
        "tpl!apps/builder/edit/templates/header.tpl",
        "tpl!apps/builder/edit/templates/landscape.tpl",
        "tpl!apps/builder/edit/templates/heroes.tpl",
        "tpl!apps/builder/edit/templates/hero_item.tpl",
        "tpl!apps/builder/edit/templates/export_save.tpl"],
function(CWApp, BuilderViews, layoutTpl, cardListTpl, deckListTpl, 
  cardLayoutTpl, headerTpl, landscapeTpl, heroesTpl, heroItemTpl, exportSaveTpl) {
  CWApp.module("BuilderApp.Edit", function(Edit, CWApp, 
          Backbone, Marionette, $, _) {

    Edit.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        cardsRegion: "#cards-region",
        deckRegion: "#deck-region"
      }
    });

    Edit.CardLayout = Marionette.LayoutView.extend({
      template: cardLayoutTpl,

      regions: {
        cardListRegion: "#card-list-region",
        landscapeRegion: "#landscape-region"
      }
    });

    Edit.Card = BuilderViews.Card.extend({
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
        "click #colors img": "colorChange"
      },

      collectionEvents: {
        "reset": "render"
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

    Edit.Landscapes = Marionette.ItemView.extend({
      template: landscapeTpl,
      className: "panel-body",

      events: {
        "change .js-landscape-select": "changeLandscape"
      },

      changeLandscape: function(e) {
        this.trigger("landscape:change", {
          id: e.target.getAttribute("data-index"),
          landscape: e.target.value
        });
      }
    });

    Edit.Hero = Marionette.ItemView.extend({
      template: heroItemTpl,
      className: "hero-image",

      triggers: {
        "click a": "hero:set"
      }
    });

    Edit.Heroes = Marionette.CompositeView.extend({
      template: heroesTpl,
      childView: Edit.Hero,
      childViewContainer: "#edit-heroes",
      className: "panel-body",

      heroChange: function() {
        this.$el.find("#changeHero").toggleClass("in");
        this.render();
      }
    });

    Edit.ExportSave = Marionette.ItemView.extend({
      template: exportSaveTpl,
      className: "panel-body",

      triggers: {
        "click #save-btn": "deck:save"
      }
    });

    Edit.Header = Marionette.LayoutView.extend({
      template: headerTpl,

      regions: {
        "landscapeRegion": "#collapseLandscapes",
        "heroesRegion": "#collapseHero",
        "saveRegion": "#collapseSave"
      }
    });

    Edit.DeckListItem = BuilderViews.DeckListItem.extend({
      editable: true,

      triggers: {
        "click": "deck:card:remove"
      },

      modelEvents: {
        "change": "render"
      }
    });

    Edit.DeckList = Marionette.CompositeView.extend({
      template: deckListTpl,
      className: "deck-container",
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
        this.ui.flash.removeClass("hidden").addClass(style).text(message).fadeOut(2000);
      }
    });
  });

  return CWApp.BuilderApp.Edit;
});
