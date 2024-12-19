"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    activateUserHandler: function() {
        return activateUserHandler;
    },
    createUserHandler: function() {
        return createUserHandler;
    },
    deactivateUserHandler: function() {
        return deactivateUserHandler;
    },
    getUserHandler: function() {
        return getUserHandler;
    },
    getUsersHandler: function() {
        return getUsersHandler;
    },
    updateUserHandler: function() {
        return updateUserHandler;
    }
});
var _zod = require("zod");
var _validation = require("../validation");
var _service = require("./service");
var _httpstatuscodes = require("http-status-codes");
var _types = require("./types");
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
// base schemas
var baseUserDataSchema = _zod.z.object({
    name: _zod.z.string(),
    email: _zod.z.string().email(),
    password: _zod.z.string(),
    role: _zod.z.enum(_types.validUserRoles),
    status: _zod.z.enum(_types.validStatuses),
    phoneNumber: _zod.z.string().regex(/^(0|62|\+62)(8[1-35-9]\d{7,10}|2[124]\d{7,8}|619\d{8}|2(?:1(?:14|500)|2\d{3})\d{3}|61\d{5,8}|(?:2(?:[35][1-4]|6[0-8]|7[1-6]|8\d|9[1-8])|3(?:1|[25][1-8]|3[1-68]|4[1-3]|6[1-3568]|7[0-469]|8\d)|4(?:0[1-589]|1[01347-9]|2[0-36-8]|3[0-24-68]|43|5[1-378]|6[1-5]|7[134]|8[1245])|5(?:1[1-35-9]|2[25-8]|3[124-9]|4[1-3589]|5[1-46]|6[1-8])|6(?:[25]\d|3[1-69]|4[1-6])|7(?:02|[125][1-9]|[36]\d|4[1-8]|7[0-36-9])|9(?:0[12]|1[013-8]|2[0-479]|5[125-8]|6[23679]|7[159]|8[01346]))\d{5,8})/).optional(),
    profileImage: _zod.z.string().optional()
});
var studentDataSchema = _zod.z.object({
    birthDate: _zod.z.string().date().transform(function(str) {
        return new Date(str);
    }),
    nis: _zod.z.string(),
    description: _zod.z.string().optional(),
    fatherName: _zod.z.string().optional(),
    motherName: _zod.z.string().optional(),
    guardianName: _zod.z.string().optional(),
    contactPhoneNumber: _zod.z.string()
});
var teacherDataSchema = _zod.z.object({
    expertise: _zod.z.string().optional(),
    bachelorDegree: _zod.z.string().optional(),
    masterDegree: _zod.z.string().optional(),
    doctorateDegree: _zod.z.string().optional(),
    description: _zod.z.string().optional(),
    nig: _zod.z.string()
});
var createUserDataSchema = baseUserDataSchema.omit({
    status: true
});
var createUserBodySchema = _zod.z.object({
    userData: createUserDataSchema,
    roleData: _zod.z.union([
        studentDataSchema,
        teacherDataSchema
    ]).optional()
});
var createUserHandler = (0, _validation.withValidation)({
    bodySchema: createUserBodySchema
}, /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(req, res, next) {
        var data, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    data = req.body;
                    return [
                        4,
                        _service.userService.create(data.userData, data.roleData)
                    ];
                case 1:
                    _state.sent();
                    res.status(_httpstatuscodes.StatusCodes.OK).json({
                        message: "User created successfully."
                    });
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    next(error);
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}());
var getUsersHandler = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(req, res, next) {
        var users, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    return [
                        4,
                        _service.userService.getAll()
                    ];
                case 1:
                    users = _state.sent();
                    res.status(_httpstatuscodes.StatusCodes.OK).json({
                        data: users
                    });
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    next(error);
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return function getUsersHandler(req, res, next) {
        return _ref.apply(this, arguments);
    };
}();
var getUserHandler = (0, _validation.withValidation)({
    paramsSchema: _validation.idParamsSchema
}, /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(req, res, next) {
        var id, user, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    id = req.params.id;
                    return [
                        4,
                        _service.userService.getById(id)
                    ];
                case 1:
                    user = _state.sent();
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    next(error);
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}());
var updateUserDataSchema = baseUserDataSchema.omit({
    role: true
});
var updateUserBodySchema = _zod.z.object({
    userData: updateUserDataSchema,
    roleData: _zod.z.union([
        studentDataSchema,
        teacherDataSchema
    ]).optional()
});
var updateUserHandler = (0, _validation.withValidation)({
    paramsSchema: _validation.idParamsSchema,
    bodySchema: updateUserBodySchema
}, /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(req, res, next) {
        var data, id, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    data = req.body;
                    id = req.params.id;
                    return [
                        4,
                        _service.userService.update(id, data.userData, data.roleData)
                    ];
                case 1:
                    _state.sent();
                    res.status(_httpstatuscodes.StatusCodes.OK).json({
                        message: "User created successfully."
                    });
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    next(error);
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}());
var activateUserHandler = (0, _validation.withValidation)({
    paramsSchema: _validation.idParamsSchema
}, /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(req, res, next) {
        var id, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        3,
                        ,
                        4
                    ]);
                    id = req.params.id;
                    return [
                        4,
                        _service.userService.getById(id)
                    ];
                case 1:
                    if (_state.sent().status == "active") {
                        res.status(_httpstatuscodes.StatusCodes.OK).json({
                            message: "User already activated!"
                        });
                    }
                    return [
                        4,
                        _service.userService.update(id, {
                            status: "active"
                        })
                    ];
                case 2:
                    _state.sent();
                    res.status(_httpstatuscodes.StatusCodes.OK).json({
                        message: "User activated successfully!"
                    });
                    return [
                        3,
                        4
                    ];
                case 3:
                    error = _state.sent();
                    next(error);
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}());
var deactivateUserHandler = (0, _validation.withValidation)({
    paramsSchema: _validation.idParamsSchema
}, /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(req, res, next) {
        var id, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        3,
                        ,
                        4
                    ]);
                    id = req.params.id;
                    return [
                        4,
                        _service.userService.getById(id)
                    ];
                case 1:
                    if (_state.sent().status == "inactive") {
                        res.status(_httpstatuscodes.StatusCodes.OK).json({
                            message: "User already inactive!"
                        });
                    }
                    return [
                        4,
                        _service.userService.update(id, {
                            status: "inactive"
                        })
                    ];
                case 2:
                    _state.sent();
                    res.status(_httpstatuscodes.StatusCodes.OK).json({
                        message: "User deactivated successfully!"
                    });
                    return [
                        3,
                        4
                    ];
                case 3:
                    error = _state.sent();
                    next(error);
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}());
