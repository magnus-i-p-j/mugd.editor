goog.provide('mugd.editor.SchemaResolver');
goog.require('goog.object');

/**
 * @param {!Object} schema
 * @constructor
 */
mugd.editor.SchemaResolver = function (schema) {
  this._schema = schema;
};

/**
 * @param {!Object} schema
 * @returns {!Object}
 */
mugd.editor.SchemaResolver.prototype.getSchema = function(schema){
  if(schema['links'] && schema['links']['rel'] === 'describedBy'){
    var describedBy = schema['links']['href'];
    describedBy = describedBy.slice(2);
    var schemaTemplate = this._resolveSchema(this._schema, describedBy.split('/'));
    this._inflateSchema(schemaTemplate, schema);
  }
  return schema;
};

/**
 * @param {!Object} template
 * @param {!Object} schema
 * @private
 */
mugd.editor.SchemaResolver.prototype._inflateSchema = function(template, schema){
  var title = schema['title'] || template['title'];
  var description = schema['description'] || template['description'];
  goog.object.forEach(template, function(value, key){
    schema[key] = value;
  });
  schema['title'] = title;
  schema['description'] = description;
};


/**
 * @param {!Object} context
 * @param {Array.<string>} keys
 * @returns {!Object}
 * @private
 */
mugd.editor.SchemaResolver.prototype._resolveSchema = function(context, keys){
  var key = keys.shift();
  context = context[key];
  if(keys.length <= 0){
    return context;
  }
  else{
    return this._resolveSchema(context, keys);
  }
};
