goog.provide('mugd.editor.SchemaResolver');

/**
 * @param {string} schema
 * @constructor
 */
mugd.editor.SchemaResolver = function (schema) {
  this._schema = schema;
};

/**
 * @param {*} schema
 * @returns {*}
 */
mugd.editor.SchemaResolver.prototype.getSchema = function(schema){
  if(schema['links'] && schema['links']['rel'] === 'describedBy'){
    var describedBy = schema['links']['rel']['href'];
    describedBy = describedBy.slice(1);
    schema = this._resolveSchema(this._schema, describedBy.split('/'));
    return schema;
  };

  /**
   * @param {*} context
   * @param {Array.<string>} keys
   * @returns {*}
   * @private
   */
  mugd.editor.SchemaResolver.prototype._resolveSchema = function(context, keys){
    var key = keys.shift();
    context = context[key];
    if(keys.length < 0){
      return context;
    }
    else{
      return this._resolveSchema(context, keys);
    }
  };
};
