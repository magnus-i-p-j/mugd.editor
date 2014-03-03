goog.provide('mugd.utils');

goog.require('goog.object');
goog.require('goog.array');

/**
 * @param {*} n
 * @returns {boolean}
 */
mugd.utils.isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * @param {*} b
 * @returns {boolean}
 */
mugd.utils.isBoolean = function (b) {
  return b.constructor === Boolean;
};

/**
 * @param {string=} prefix
 * @param {string=} separator
 * @return {!mugd.utils.guid}
 */
mugd.utils.getGuid = function (prefix, separator) {
  prefix = prefix || '';
  separator = separator || ':';
  if (prefix) {
    return prefix.toString() + separator + mugd.utils._create();
  }
  return mugd.utils._create();
};

/**
 * @return {!mugd.utils.guid}
 * @private
 */
mugd.utils._create = function () {
  return /** @type {!mugd.utils.guid} */ (mugd.utils.EMPTY_GUID.replace(/[0]/g, mugd.utils._selectChar));
};

/**
 * @return {string}
 * @private
 */
mugd.utils._selectChar = function () {
  var index = Math.floor(Math.random() * mugd.utils.CHOOSE_CHARS.length);
  return mugd.utils.CHOOSE_CHARS[index];
};

/**
 * @const
 */
mugd.utils.EMPTY_GUID = '00000-00000-00000-00000-00000-00000';

/**
 * @const
 */
mugd.utils.CHOOSE_CHARS = 'abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789';

/** @typedef {string} */
mugd.utils.guid;

/**
 * @param {Object.<string, string>} i18n
 * @param {string} prefix
 * @param {string} title
 * @return {string}
 */
mugd.utils.cssify = function (title, prefix, i18n) {
  prefix = prefix || 'cssify_';
  i18n = i18n ||
    {
      'å': 'a',
      'ä': 'a',
      'ö': 'o'
    };
  var css = title.toLowerCase();
  var replaceI18n = goog.array.reduce(
    goog.object.getKeys(i18n),
    function(result, value){
      result += value;
      return result;
    },
    '['
  ) + ']';
  css = css.replace(new RegExp(replaceI18n), function(match){
    return goog.array.map( match, function(s){
      return i18n[s];
    })
  });

  css = css.replace(/[^a-z0-9]/g, '_');
  return prefix + css;
}


goog.exportSymbol('editor.cssify', mugd.utils.cssify );

