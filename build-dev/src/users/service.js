"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "userService", {
    enumerable: true,
    get: function() {
        return userService;
    }
});
var _error = require("../error");
var _prismaclient = require("../prisma-client");
var _bcryptjs = /*#__PURE__*/ _interop_require_default(require("bcryptjs"));
var _nanoid = require("nanoid");
var _types = require("./types");
var _httpstatuscodes = require("http-status-codes");
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
var prisma = _prismaclient.prismaInstance;
var addRoleData = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(user) {
        var userCopy;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    userCopy = user;
                    if (!(user.role == _types.UserRoles.STUDENT)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        prisma.student.findFirst({
                            where: {
                                id: user.id
                            }
                        })
                    ];
                case 1:
                    userCopy.roleData = _state.sent();
                    _state.label = 2;
                case 2:
                    if (!(user.role == _types.UserRoles.TEACHER)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        prisma.teacher.findFirst({
                            where: {
                                id: user.id
                            }
                        })
                    ];
                case 3:
                    userCopy.roleData = _state.sent();
                    _state.label = 4;
                case 4:
                    return [
                        2,
                        userCopy
                    ];
            }
        });
    });
    return function addRoleData(user) {
        return _ref.apply(this, arguments);
    };
}();
var UserService = /*#__PURE__*/ function() {
    "use strict";
    function UserService() {
        _class_call_check(this, UserService);
    }
    _create_class(UserService, [
        {
            key: "getUserDetails",
            value: function getUserDetails(user) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!(user.role == _types.UserRoles.STUDENT)) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    prisma.student.findFirst({
                                        where: {
                                            id: user.id
                                        }
                                    })
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                            case 2:
                                if (!(user.role == _types.UserRoles.TEACHER)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    prisma.teacher.findFirst({
                                        where: {
                                            id: user.id
                                        }
                                    })
                                ];
                            case 3:
                                return [
                                    2,
                                    _state.sent()
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getByEmail",
            value: function getByEmail(email) {
                var _this = this;
                return _async_to_generator(function() {
                    var user, details;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    prisma.user.findFirst({
                                        where: {
                                            email: email
                                        }
                                    })
                                ];
                            case 1:
                                user = _state.sent();
                                if (!user) {
                                    throw (0, _error.createErrorWithMessage)(_httpstatuscodes.StatusCodes.NOT_FOUND, "Email not found");
                                }
                                return [
                                    4,
                                    _this.getUserDetails(user)
                                ];
                            case 2:
                                details = _state.sent();
                                return [
                                    2,
                                    details ? _object_spread_props(_object_spread({}, user), {
                                        details: details
                                    }) : user
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getById",
            value: function getById(id) {
                var _this = this;
                return _async_to_generator(function() {
                    var user, details;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    prisma.user.findFirst({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 1:
                                user = _state.sent();
                                if (!user) {
                                    throw (0, _error.createErrorWithMessage)(_httpstatuscodes.StatusCodes.NOT_FOUND, "ID not found");
                                }
                                return [
                                    4,
                                    _this.getUserDetails(user)
                                ];
                            case 2:
                                details = _state.sent();
                                return [
                                    2,
                                    details ? _object_spread_props(_object_spread({}, user), {
                                        details: details
                                    }) : user
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getAll",
            value: function getAll() {
                return _async_to_generator(function() {
                    var users;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    prisma.user.findMany()
                                ];
                            case 1:
                                users = _state.sent();
                                return [
                                    2,
                                    users
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "create",
            value: function create(userData) {
                var roleData = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                var _this = this;
                return _async_to_generator(function() {
                    var id;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getByEmail(userData.email)
                                ];
                            case 1:
                                if (_state.sent()) {
                                    throw (0, _error.createFieldError)({
                                        email: "Email is already registered!"
                                    });
                                }
                                id = (0, _nanoid.nanoid)();
                                return [
                                    4,
                                    prisma.$transaction(/*#__PURE__*/ function() {
                                        var _ref = _async_to_generator(function(tx) {
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        return [
                                                            4,
                                                            tx.user.create({
                                                                data: _object_spread({
                                                                    id: id,
                                                                    status: "active"
                                                                }, userData)
                                                            })
                                                        ];
                                                    case 1:
                                                        _state.sent();
                                                        if (!(userData.role == _types.UserRoles.STUDENT)) return [
                                                            3,
                                                            3
                                                        ];
                                                        if (!(roleData && "nis" in roleData)) {
                                                            throw (0, _error.createFieldError)({
                                                                roleData: "Invalid role data!"
                                                            });
                                                        }
                                                        return [
                                                            4,
                                                            tx.student.create({
                                                                data: _object_spread({
                                                                    id: id
                                                                }, roleData)
                                                            })
                                                        ];
                                                    case 2:
                                                        _state.sent();
                                                        return [
                                                            3,
                                                            5
                                                        ];
                                                    case 3:
                                                        if (!(userData.role == _types.UserRoles.TEACHER)) return [
                                                            3,
                                                            5
                                                        ];
                                                        if (!(roleData && "nig" in roleData)) {
                                                            throw (0, _error.createFieldError)({
                                                                roleData: "Invalid role data!"
                                                            });
                                                        }
                                                        return [
                                                            4,
                                                            tx.teacher.create({
                                                                data: _object_spread({
                                                                    id: id
                                                                }, roleData)
                                                            })
                                                        ];
                                                    case 4:
                                                        _state.sent();
                                                        _state.label = 5;
                                                    case 5:
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        });
                                        return function(tx) {
                                            return _ref.apply(this, arguments);
                                        };
                                    }())
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "update",
            value: function update(id, userData) {
                var roleData = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (userData.password) {
                                    userData.password = _bcryptjs.default.hashSync(userData.password);
                                }
                                return [
                                    4,
                                    prisma.$transaction(/*#__PURE__*/ function() {
                                        var _ref = _async_to_generator(function(tx) {
                                            var user;
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        return [
                                                            4,
                                                            tx.user.update({
                                                                where: {
                                                                    id: id
                                                                },
                                                                data: userData
                                                            })
                                                        ];
                                                    case 1:
                                                        _state.sent();
                                                        if (!roleData) return [
                                                            2
                                                        ];
                                                        return [
                                                            4,
                                                            _this.getById(id)
                                                        ];
                                                    case 2:
                                                        user = _state.sent();
                                                        if (!(user.role == _types.UserRoles.TEACHER)) return [
                                                            3,
                                                            4
                                                        ];
                                                        return [
                                                            4,
                                                            tx.teacher.update({
                                                                where: {
                                                                    id: id
                                                                },
                                                                data: _object_spread({}, roleData)
                                                            })
                                                        ];
                                                    case 3:
                                                        _state.sent();
                                                        return [
                                                            3,
                                                            6
                                                        ];
                                                    case 4:
                                                        if (!(user.role == _types.UserRoles.STUDENT)) return [
                                                            3,
                                                            6
                                                        ];
                                                        return [
                                                            4,
                                                            tx.student.update({
                                                                where: {
                                                                    id: id
                                                                },
                                                                data: _object_spread({}, roleData)
                                                            })
                                                        ];
                                                    case 5:
                                                        _state.sent();
                                                        _state.label = 6;
                                                    case 6:
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        });
                                        return function(tx) {
                                            return _ref.apply(this, arguments);
                                        };
                                    }())
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return UserService;
}();
var userService = new UserService();
