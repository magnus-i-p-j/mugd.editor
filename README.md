#JSON Editor
Outputs a editor based on a JSON-schema. The editor is completely self-contained in the sense that it won't cause any
redirect, reloads or anything of that sort. Heavily based on knockout.js.

## Base JSON-schema support
All of the seven primitive types, arrays and objects are supported.

## Supported JSON-schema keywords
* enum
* href
    * self
    * full

## Soon to be supported JSON-schema keywords
* describedBy
* required