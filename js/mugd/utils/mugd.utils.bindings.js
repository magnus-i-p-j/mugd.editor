goog.provide('mugd.utils.bindings');

mugd.utils.bindings.addScaledImage = function () {
  ko.bindingHandlers['scaledImage'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      // This will be called when the binding is first applied to an element
      // Set up any initial state, event handlers, etc. here
    },
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      // This will be called once when the binding is first applied to an element,
      // and again whenever the associated observable changes value.
      // Update the DOM element based on the supplied values here.
      var img = new Image();
      img.onload = function () {
        var ratio = Math.min(element.width / img.width, element.height / img.height, 1);
        var width = img.width * ratio;
        var height = img.height * ratio;

        var ctx = element.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
      };
      var value = valueAccessor();
      img.src = ko.unwrap(value);
    }
  };

};