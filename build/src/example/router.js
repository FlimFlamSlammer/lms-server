"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setupExampleRouter", {
    enumerable: true,
    get: function() {
        return setupExampleRouter;
    }
});
var _express = /*#__PURE__*/ _interop_require_default(require("express"));
var _handler = require("./handler");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var setupExampleRouter = function(router) {
    var exampleRouter = _express.default.Router();
    exampleRouter.get("/:id", _handler.getExampleHandler);
    router.use("/example", exampleRouter);
};
