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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var setupUsersRouter = function(router) {
    var usersRouter = _express.default.Router();
    usersRouter.post("/", _handler.createUserHandler);
    usersRouter.put("/:id", _handler.updateUserHandler);
    usersRouter.patch("/:id/activate", _handler.activateUserHandler);
    usersRouter.patch("/:id/deactivate", _handler.deactivateUserHandler);
    usersRouter.get("/:id", _handler.getUserHandler);
    usersRouter.get("/", _handler.getUsersHandler);
    router.use("/users", usersRouter);
};
