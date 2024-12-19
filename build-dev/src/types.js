"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "idParamsSchema", {
    enumerable: true,
    get: function() {
        return idParamsSchema;
    }
});
var _zod = require("zod");
var idParamsSchema = _zod.z.object({
    id: _zod.z.string()
});
