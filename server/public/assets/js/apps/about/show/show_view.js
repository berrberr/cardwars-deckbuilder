define(["marionette",
        "tpl!apps/about/show/templates/show.tpl"],
  function(Marionette, showTpl) {

  return {
    Message: Marionette.ItemView.extend({
      template: showTpl
    })
  };
});
