function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import { userService } from "../user/service";
import { prismaInstance } from "../prisma-client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createErrorWithMessage, createFieldError } from "../error";
import { StatusCodes } from "http-status-codes";
var AUTH_TOKEN_EXPIRES_IN = "2d";
var prisma = prismaInstance;
var AuthService = /*#__PURE__*/ function() {
    "use strict";
    function AuthService() {
        _class_call_check(this, AuthService);
    }
    _create_class(AuthService, [
        {
            key: "login",
            value: function login(email, password) {
                return _async_to_generator(function() {
                    var user, authToken;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    userService.getByEmail(email)
                                ];
                            case 1:
                                user = _state.sent();
                                if (!user) {
                                    throw createFieldError({
                                        email: "Email not registered!"
                                    });
                                }
                                if (!bcrypt.compareSync(password, user.password)) {
                                    throw createFieldError({
                                        email: "Incorrect credentials!",
                                        password: "Incorrect credentials!"
                                    });
                                }
                                authToken = jwt.sign({
                                    id: user.id
                                }, process.env.JWT_SECRET || "", {
                                    expiresIn: AUTH_TOKEN_EXPIRES_IN
                                });
                                return [
                                    2,
                                    authToken
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "verifyAuthToken",
            value: function verifyAuthToken(authToken) {
                return _async_to_generator(function() {
                    var userId, user, e;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!authToken) {
                                    throw createErrorWithMessage(StatusCodes.UNAUTHORIZED, "Auth token invalid!");
                                }
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                userId = jwt.verify(authToken, process.env.JWT_SECRET || "").id;
                                return [
                                    4,
                                    userService.getById(userId)
                                ];
                            case 2:
                                user = _state.sent();
                                if (!user) {
                                    throw createErrorWithMessage(StatusCodes.NOT_FOUND, "User does not exist.");
                                }
                                return [
                                    2,
                                    user
                                ];
                            case 3:
                                e = _state.sent();
                                throw createErrorWithMessage(StatusCodes.UNAUTHORIZED, "Auth token invalid!");
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return AuthService;
}();
export var authService = new AuthService();
