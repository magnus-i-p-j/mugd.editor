goog.provide('mugd.editor.WindowViewModel');


/**
 * @param {!mugd.editor.IViewModel} model
 * @constructor
 */
mugd.editor.WindowViewModel = function(model) {
  this['model'] = ko.observable(model);
};
