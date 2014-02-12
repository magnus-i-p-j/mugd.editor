goog.provide('mugd.editor.EditorViewModel');

goog.require('goog.net.XhrIo');

/**
 * @constructor
 * @param {string} schema
 * @param {string} data
 */
mugd.editor.EditorViewModel = function (schema, data) {
  this['schemaUri'] = ko.observable(schema);
  this['dataUri'] = ko.observable(data);
  this['model'] = ko.observable();
  this['ui'] = {
    'selected': ko.observable()
  };
  this['tools'] = {
    'state': ko.observable('collapsed')
  }
};

mugd.editor.EditorViewModel.prototype['loadModel'] = function () {
  var self = this;
  goog.net.XhrIo.send(self['schemaUri'](),
      function (e) {
        var schema = e.target.getResponseJson();
        goog.net.XhrIo.send(self['dataUri'](),
            function (e) {
              var data = e.target.getResponseJson();
              self['model'](mugd.editor.getViewModel(schema, data));
              self['model']()['fileName'](self['dataUri']().split('/').pop());
            }
        );
      }
  );
};

