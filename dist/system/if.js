System.register(["aurelia-templating"], function (_export) {
  "use strict";

  var TemplateController, Property, BoundViewFactory, ViewSlot, If;
  return {
    setters: [function (_aureliaTemplating) {
      TemplateController = _aureliaTemplating.TemplateController;
      Property = _aureliaTemplating.Property;
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
    }],
    execute: function () {
      If = function If(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.showing = false;
      };

      If.annotations = function () {
        return [new TemplateController("if"), new Property("value", "valueChanged", "if")];
      };

      If.inject = function () {
        return [BoundViewFactory, ViewSlot];
      };

      If.prototype.valueChanged = function (newValue) {
        if (!newValue) {
          if (this.view) {
            this.viewSlot.remove(this.view);
            this.view.unbind();
          }

          this.showing = false;
          return;
        }

        if (!this.view) {
          this.view = this.viewFactory.create();
        }

        if (!this.showing) {
          this.showing = true;

          if (!this.view.bound) {
            this.view.bind();
          }

          this.viewSlot.add(this.view);
        }
      };

      _export("If", If);
    }
  };
});