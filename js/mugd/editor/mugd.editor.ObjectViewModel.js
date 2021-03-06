goog.provide('mugd.editor.ObjectViewModel');

goog.require('mugd.editor.constants');
goog.require('mugd.editor.IViewModel');
goog.require('mugd.editor.AbstractViewModel');
goog.require('goog.object');
goog.require('goog.array');

/**
 * @param {!Object} schema
 * @param {!mugd.editor.LinkResolver} resolver
 * @param getSubModel
 * @implements mugd.editor.IViewModel
 * @extends mugd.editor.AbstractViewModel
 * @constructor
 */
mugd.editor.ObjectViewModel = function (schema, resolver, getSubModel) {
  goog.base(this, schema, resolver);

  this['properties'] = ko.observableArray();


  var properties = {};
  goog.object.forEach(schema['properties'],
    function (value, key, allValues) {
      var subModel = getSubModel(value);
      properties[key] = subModel;
      this['properties'].push(subModel);
      subModel['required'] = !!(schema['required'] && goog.array.contains(schema['required'], key));
      if (subModel['required']) {
        subModel['hasValue'] = function(){
          return true;
        };
      }else{
        subModel['hasValue'] = ko.observable(false);
      }
    }, this
  );
  this['value'] = ko.observable(properties);

  this['valid'] = ko.computed(
    function () {
      var valid = goog.array.every(this['properties'](),
        function (property) {
          return property['valid']();
        });
      return valid;
    }, this
  );

  resolver.put(this, schema);
};
goog.inherits(mugd.editor.ObjectViewModel, mugd.editor.AbstractViewModel);

mugd.editor.ObjectViewModel.prototype['toJSON'] = function () {
  var definedValues = goog.object.filter( this['value'](), function(value){
    return value['hasValue']();
  });
  return goog.object.map(definedValues,
    function (value) {
      return value['toJSON']();
    }
  );
};

mugd.editor.ObjectViewModel.prototype['setValue'] = function (newValue) {
  var current = this['value']();
  goog.object.forEach(newValue,
    function (value, key) {
      if (current[key]) {
        current[key]['hasValue'](true);
        current[key]['setValue'](value);
      }
      else {
        console.log("Discarding value for: " + key);
      }
    }
  );
};

/**
 * @param {Array} path
 * @param {number=}index
 * @returns {*}
 */
mugd.editor.ObjectViewModel.prototype.fetchSplitPath = function (path, index) {
  if (!goog.isDef(index)) {
    index = 0;
  }

  if (index === path.length) {
    return this;
  }

  var head = path[index];
  var value = this['value']();
  if (value[head]) {
    return value[head].fetchSplitPath(path, index + 1);
  }
  throw {'name': 'InvalidPathException', 'message': path};
};

mugd.editor.ObjectViewModel.isObjectValue = function (schema) {
  return schema.type === mugd.editor.constants.ValueType.OBJECT;
};

/**
 * @inheritDoc
 */
mugd.editor.ObjectViewModel.prototype.disposeInternal = function () {
  goog.object.forEach(this['value'](), function (model) {
    model.dispose();
  });
  goog.base(this, 'disposeInternal');
};

mugd.editor.ObjectViewModel.prototype['title'] = function () {
};

mugd.editor.ObjectViewModel.prototype['type'] = function (value) {
  return mugd.editor.constants.ValueType.OBJECT;
};
mugd.editor.ObjectViewModel.prototype['description'] = function () {
};