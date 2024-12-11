"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setupAuthRouter", {
    enumerable: true,
    get: function() {
        return setupAuthRouter;
    }
});
var _express = /*#__PURE__*/ _interop_require_default(require("express"));
var _handler = require("./handler");
var _middleware = require("./middleware");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var setupAuthRouter = function(router) {
    var authRouter = _express.default.Router();
    authRouter.post("/login", _handler.loginHandler);
    authRouter.post("/logout", _handler.logoutHandler);
    authRouter.get("/user", (0, _middleware.authMiddleware)(), _handler.getUserHandler);
    router.use("/auth", authRouter);
};
