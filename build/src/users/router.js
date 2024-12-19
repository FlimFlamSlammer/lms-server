"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setupUsersRouter", {
    enumerable: true,
    get: function() {
        return setupUsersRouter;
    }
});
var _express = /*#__PURE__*/ _interop_require_default(require("express"));
var _handler = require("./handler");
var _middleware = require("../auth/middleware");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var setupUsersRouter = function(router) {
    var usersRouter = _express.default.Router();
    usersRouter.post("/", (0, _middleware.authMiddleware)([
        "Admin, SuperAdmin"
    ]), _handler.createUserHandler);
    usersRouter.put("/:id", (0, _middleware.authMiddleware)([
        "Admin, SuperAdmin"
    ]), _handler.updateUserHandler);
    usersRouter.patch("/:id/activate", (0, _middleware.authMiddleware)([
        "Admin, SuperAdmin"
    ]), _handler.activateUserHandler);
    usersRouter.patch("/:id/deactivate", (0, _middleware.authMiddleware)([
        "Admin, SuperAdmin"
    ]), _handler.deactivateUserHandler);
    usersRouter.get("/:id", (0, _middleware.authMiddleware)([
        "Admin, SuperAdmin"
    ]), _handler.getUserHandler);
    usersRouter.get("/", (0, _middleware.authMiddleware)([
        "Admin, SuperAdmin"
    ]), _handler.getUsersHandler);
    router.use("/users", usersRouter);
};
