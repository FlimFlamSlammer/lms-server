"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setupSubjectsRouter", {
    enumerable: true,
    get: function() {
        return setupSubjectsRouter;
    }
});
var _express = /*#__PURE__*/ _interop_require_default(require("express"));
var _handler = require("./handler");
var _middleware = require("../auth/middleware");
var _types = require("../users/types");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var setupSubjectsRouter = function(router) {
    var subjectsRouter = _express.default.Router();
    subjectsRouter.post("/", (0, _middleware.authMiddleware)([
        _types.UserRoles.ADMIN,
        _types.UserRoles.SUPERADMIN
    ]), _handler.createSubjectHandler);
    subjectsRouter.put("/:id", (0, _middleware.authMiddleware)([
        _types.UserRoles.ADMIN,
        _types.UserRoles.SUPERADMIN
    ]), _handler.updateSubjectHandler);
    subjectsRouter.get("/:id", (0, _middleware.authMiddleware)([
        _types.UserRoles.ADMIN,
        _types.UserRoles.SUPERADMIN
    ]), _handler.getSubjectHandler);
    subjectsRouter.get("/", (0, _middleware.authMiddleware)([
        _types.UserRoles.ADMIN,
        _types.UserRoles.SUPERADMIN
    ]), _handler.getSubjectsHandler);
    router.use("/subjects", subjectsRouter);
};
