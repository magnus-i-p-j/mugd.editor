goog.provide('mugd.editor.PrimitiveViewModel');

goog.require('mugd.editor.constants');
goog.require('mugd.utils');
goog.require('mugd.editor.IViewModel');
goog.require('mugd.editor.AbstractViewModel');
goog.require('goog.array');

/**
 * @param {!Object} schema
 * @param {!mugd.editor.LinkResolver} resolver
 * @extends mugd.editor.AbstractViewModel
 * @constructor
 */
mugd.editor.PrimitiveViewModel = function (schema, resolver) {
  goog.base(this, schema, resolver);

  /**
   * @type {function(*=):(*)}
   * @private
   */
  var _value = ko.observable();
  /**
   * @type {function(string=):{value: (string|number|boolean), errors:[string]}}
   */
  var validateValueCallback = mugd.editor.PrimitiveViewModel.validateValue[this['type']](schema);
  /**
   * @type {function(string=):(string|number|boolean)}
   */
  this['value'] = ko.computed(
    {
      'read': function () {
        return _value();
      },
      'write': function (value) {
        var validatedValue = validateValueCallback(value);
        _value(validatedValue.value);
        this['errors'].removeAll();
        goog.array.extend(this['errors'], validatedValue.errors);
      }
    }, this
  );

};

goog.inherits(mugd.editor.PrimitiveViewModel, mugd.editor.AbstractViewModel);

mugd.editor.PrimitiveViewModel.prototype['toJSON'] = function () {
  return this['value']();
};

mugd.editor.PrimitiveViewModel.prototype['setValue'] = function (value) {
  this['value'](value);
};

/**
 * @param {!Array} path
 * @param {number=}index
 * @returns {*}
 */
mugd.editor.PrimitiveViewModel.prototype.fetchSplitPath = function (path, index) {
  if (!goog.isDef(index)) {
    index = 0;
  }

  if (index === path.length) {
    return this;
  }

  if (path[index] === '') {
    return this['value']();
  }

  throw {'name': 'InvalidPathException', 'message': path};
};

mugd.editor.PrimitiveViewModel.isPrimitiveValue = function (schema) {
  return goog.array.contains([
    mugd.editor.constants.ValueType.STRING,
    mugd.editor.constants.ValueType.NUMBER,
    mugd.editor.constants.ValueType.BOOLEAN
//      mugd.editor.constants.ValueType.STRING,
//      mugd.editor.constants.ValueType.STRING
  ],
    schema['type']
  );
};

/**
 * @inheritDoc
 */
mugd.editor.PrimitiveViewModel.prototype.disposeInternal = function () {
  goog.base(this, 'disposeInternal');
};

/**
 * @type {Object.<string, function(*):function(string=):{value: (string|number|boolean), errors:[string]}>}
 */
mugd.editor.PrimitiveViewModel.validateValue = {};
mugd.editor.PrimitiveViewModel.validateValue[mugd.editor.constants.ValueType.STRING] =
  function (schema) {
    return function (value) {
      var errors = [];
      if (!goog.isString(value)) {
        throw {'name': 'TypeMismatchException', 'reason': 'Expected string', 'value': value};
      }

      if(schema['pattern']){
        var format = new RegExp(schema['pattern']);
        if(!format.test(value)){
          var error = "Value must match: " + schema['pattern'];
          errors.push(error);
        }
      }

      return {value: value, errors: errors};
    };
  };
mugd.editor.PrimitiveViewModel.validateValue[mugd.editor.constants.ValueType.NUMBER] =
  function (schema) {
    return function (value) {
      if (!mugd.utils.isNumber(value)) {
        throw {'name': 'TypeMismatchException', 'reason': 'Expected number', 'value': value};
      }
      return {value: parseFloat(value)};
    };
  };

mugd.editor.PrimitiveViewModel.validateValue[mugd.editor.constants.ValueType.BOOLEAN] =
  function (schema) {
    return function (value) {
      if (!mugd.utils.isBoolean(value)) {
        throw {'name': 'TypeMismatchException', 'reason': 'Expected boolean', 'value': value};
      }
      return {value: !!value};
    };
  };


