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
    createUserHandler: function() {
        return createUserHandler;
    },
    getUserHandler: function() {
        return getUserHandler;
    },
    getUsersHandler: function() {
        return getUsersHandler;
    }
});
var _zod = require("zod");
var _validation = require("../validation");
var _service = require("./service");
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
var userDataSchema = _zod.z.object({
    name: _zod.z.string(),
    email: _zod.z.string().email(),
    password: _zod.z.string(),
    role: _zod.z.enum(_service.validUserRoles)
});
var studentDataSchema = _zod.z.object({
    birthDate: _zod.z.date(),
    nis: _zod.z.string(),
    description: _zod.z.string().optional(),
    fatherName: _zod.z.string().optional(),
    motherName: _zod.z.string().optional(),
    guardianName: _zod.z.string().optional(),
    contactPhoneNumber: _zod.z.string()
});
var teacherDataSchema = _zod.z.object({
    expoertise: _zod.z.string().optional(),
    bachelorDegree: _zod.z.string().optional(),
    masterDegree: _zod.z.string().optional(),
    doctorateDegree: _zod.z.string().optional(),
    description: _zod.z.string().optional(),
    nig: _zod.z.string()
});
var createUserBodySchema = _zod.z.object({
    userData: userDataSchema,
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
var getUserParamsSchema = _zod.z.object({
    id: _zod.z.string().length(21)
});
var getUserHandler = (0, _validation.withValidation)({
    paramsSchema: getUserParamsSchema
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
