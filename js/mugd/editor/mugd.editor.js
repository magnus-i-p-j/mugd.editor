goog.provide('mugd.editor');

goog.require('mugd.editor.EditorViewModel');
goog.require('mugd.editor.PrimitiveViewModel');
goog.require('mugd.editor.ObjectViewModel');
goog.require('mugd.editor.ArrayViewModel');
goog.require('mugd.editor.FullLinkViewModel');
goog.require('mugd.editor.EnumViewModel');
goog.require('mugd.editor.LinkResolver');

goog.require('mugd.utils.bindings');

/**
 * @param {!Object} schema
 * @param {*} data
 * @return {mugd.editor.IViewModel}
 */
mugd.editor.getViewModel = function (schema, data) {
  var resolver = new mugd.editor.LinkResolver();
  var model = mugd.editor._getModel(schema, resolver);
  model['setValue'](data);
  return model;
};

/**
 * @param {!Object} schema
 * @return {mugd.editor.IViewModel}
 * @private
 * @param resolver
 */
mugd.editor._getModel = function (schema, resolver) {
  if (mugd.editor.FullLinkViewModel.isFullLinkValue(schema)) {
    return new mugd.editor.FullLinkViewModel(schema, resolver);
  }
  if (mugd.editor.EnumViewModel.isEnumValue(schema)) {
    return new mugd.editor.EnumViewModel(schema, resolver);
  }
  if (mugd.editor.PrimitiveViewModel.isPrimitiveValue(schema)) {
    return new mugd.editor.PrimitiveViewModel(schema, resolver);
  }
  if (mugd.editor.ObjectViewModel.isObjectValue(schema)) {
    return new mugd.editor.ObjectViewModel(schema, resolver, mugd.editor._getModel);
  }
  if (mugd.editor.ArrayViewModel.isArrayValue(schema)) {
    return new mugd.editor.ArrayViewModel(schema, resolver, function () {
      return mugd.editor._getModel(schema['items'], resolver);
    });
  }

  throw {'name': 'TypeMismatchException', 'reason': 'no such type supported', 'schema': schema};
};

/**
 * @param {!Element} rootNode
 * @param {!Object.<string,string>} config
 * @return {mugd.editor.EditorViewModel}
 */
mugd.editor.init = function (rootNode, config) {
  infuser.defaults.templatePrefix = 'tpl/editor/';
  mugd.utils.bindings.addScaledImage();

  var vm = new mugd.editor.EditorViewModel(config.schema, config.data);
  ko.applyBindings(vm, rootNode);

  return vm;
};

goog.exportSymbol('editor.init', mugd.editor.init);


