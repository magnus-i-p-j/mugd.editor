goog.provide('mugd.utils.bindings');

/**
 * Browsers tend to get sluggish when resizing several img elements on the fly. This binding does the resizing
 * once and throws away the source.
 */
mugd.utils.bindings.addScaledImage = function () {
  ko.bindingHandlers['scaledImage'] = {
//    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
//      // This will be called when the binding is first applied to an element
//      // Set up any initial state, event handlers, etc. here
//    },
    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      // This will be called once when the binding is first applied to an element,
      // and again whenever the associated observable changes value.
      // Update the DOM element based on the supplied values here.
      var img = new Image();
      img.onload = function () {
        // Set internal width the same as visual width
        element.width = $(element).width();
        element.height = $(element).height();
        var ratio = Math.min(element.width / img.width, element.height / img.height, 1);
        var width = img.width * ratio;
        var height = img.height * ratio;
        var dx = element.width /2 - width/2;
        var dy = (element.height - height) / 4;

        var ctx = element.getContext('2d');
        ctx.drawImage(img, dx, dy, width, height);
        img.onload = null;
      };
      var value = valueAccessor();
      img.src = ko.unwrap(value);
    }
  };

};