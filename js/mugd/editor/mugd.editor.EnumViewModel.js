/**
 * Created by ludvigssonma on 2014-01-30.
 */

goog.provide('mugd.editor.EnumViewModel');

goog.require('mugd.editor.constants');
goog.require('mugd.editor.IViewModel');
goog.require('mugd.editor.AbstractViewModel');

/**
 * @param {!Object} schema
 * @param {!mugd.editor.LinkResolver} resolver
 * @extends mugd.editor.AbstractViewModel
 * @constructor
 */
mugd.editor.EnumViewModel = function (schema, resolver) {
  goog.base(this, schema, resolver);

  this['template']('enum');
  this['values'] = ko.observableArray(schema['enum']);
  this['value'] = ko.observable(this['values']()[0]);
};

goog.inherits(mugd.editor.EnumViewModel, mugd.editor.AbstractViewModel);

mugd.editor.EnumViewModel.prototype['toJSON'] = function () {
  return this['value']();
};

/**
 * @param {Object} schema
 * @return {boolean}
 */
mugd.editor.EnumViewModel.isEnumValue = function (schema) {
  return goog.isDefAndNotNull(schema['enum']);
};

mugd.editor.EnumViewModel.prototype['setValue'] = function (newValue) {
  this['value'](newValue);
};
