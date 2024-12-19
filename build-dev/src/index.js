"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _express = /*#__PURE__*/ _interop_require_default(require("express"));
var _error = require("./error");
var _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
var _router = require("./auth/router");
var _router1 = require("./users/router");
var _router2 = require("./subjects/router");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var app = (0, _express.default)();
var PORT = process.env.PORT || 5000;
app.use(_express.default.json());
app.use((0, _cookieparser.default)());
var baseRouter = _express.default.Router();
(0, _router.setupAuthRouter)(baseRouter);
(0, _router1.setupUsersRouter)(baseRouter);
(0, _router2.setupSubjectsRouter)(baseRouter);
app.use("/api/v1", baseRouter);
app.use(_error.errorMiddleware);
app.listen(PORT, function() {
    console.log("Server is running on http://localhost:".concat(PORT));
});
