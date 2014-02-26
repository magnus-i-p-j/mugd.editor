goog.provide('mugd.editor');

goog.require('mugd.editor.EditorViewModel');
goog.require('mugd.editor.PrimitiveViewModel');
goog.require('mugd.editor.ObjectViewModel');
goog.require('mugd.editor.ArrayViewModel');
goog.require('mugd.editor.FullLinkViewModel');
goog.require('mugd.editor.EnumViewModel');
goog.require('mugd.editor.LinkResolver');
goog.require('mugd.editor.SchemaResolver');

goog.require('mugd.utils.bindings');

/**
 * @param {!Object} schema
 * @param {*} data
 * @return {mugd.editor.IViewModel}
 */
mugd.editor.getViewModel = function (schema, data) {
  var linkResolver = new mugd.editor.LinkResolver();
  var schemaResolver = new mugd.editor.SchemaResolver(schema);
  var model = mugd.editor._getModel(schema, schemaResolver, linkResolver);
  model['setValue'](data);
  return model;
};

/**
 * @param {!Object} schema
 * @return {mugd.editor.IViewModel}
 * @private
 * @param {!mugd.editor.SchemaResolver} schemaResolver
 * @param {!mugd.editor.LinkResolver} linkResolver
 */
mugd.editor._getModel = function (schema, schemaResolver, linkResolver) {
  schema = schemaResolver.getSchema(schema);
  if (mugd.editor.FullLinkViewModel.isFullLinkValue(schema)) {
    return new mugd.editor.FullLinkViewModel(schema, linkResolver);
  }
  if (mugd.editor.EnumViewModel.isEnumValue(schema)) {
    return new mugd.editor.EnumViewModel(schema, linkResolver);
  }
  if (mugd.editor.PrimitiveViewModel.isPrimitiveValue(schema)) {
    return new mugd.editor.PrimitiveViewModel(schema, linkResolver);
  }
  if (mugd.editor.ObjectViewModel.isObjectValue(schema)) {
    return new mugd.editor.ObjectViewModel(schema, linkResolver, function(subModel){
      return mugd.editor._getModel(subModel, schemaResolver, linkResolver);
    });
  }
  if (mugd.editor.ArrayViewModel.isArrayValue(schema)) {
    return new mugd.editor.ArrayViewModel(schema, linkResolver, function () {
      return mugd.editor._getModel(schema['items'], schemaResolver, linkResolver);
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
  if(typeof infuser !== 'undefined'){
    infuser.defaults.templatePrefix = 'tpl/editor/';
  }
  mugd.utils.bindings.addScaledImage();

  var vm = new mugd.editor.EditorViewModel(config.schema, config.data);
  ko.applyBindings(vm, rootNode);

  return vm;
};

goog.exportSymbol('editor.init', mugd.editor.init);


