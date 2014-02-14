#JSON Editor
Outputs a editor based on a JSON-schema. The editor is completely self-contained in the sense that it won't cause any
redirect, reloads or anything of that sort. Heavily based on knockout.js.

## Base JSON-schema support
All of the seven primitive types, arrays and objects are supported.

## Supported JSON-schema keywords
* enum
* href
    * self:
      Used to register a resource in order to be able to reference it with a full link.
    * full
      References a resource previously publish with a self link.
    * required
      All properties listed in the required array will be marked in the editor.
    * pattern:
      Strings have to conform to the specified pattern.

## Soon to be supported JSON-schema keywords
* describedBy
