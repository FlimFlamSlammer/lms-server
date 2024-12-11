"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getExampleQuerySchema", {
    enumerable: true,
    get: function() {
        return getExampleQuerySchema;
    }
});
var _zod = require("zod");
var getExampleQuerySchema = _zod.z.object({
    id: _zod.z.string()
});
