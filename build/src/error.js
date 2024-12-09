function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
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
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function wrapNativeSuper(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _get_prototype_of(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _set_prototype_of(Wrapper, Class);
    };
    return _wrap_native_super(Class);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
import { StatusCodes } from "http-status-codes";
var CustomError = /*#__PURE__*/ function(Error1) {
    "use strict";
    _inherits(CustomError, Error1);
    function CustomError(status) {
        _class_call_check(this, CustomError);
        var _this;
        _this = _call_super(this, CustomError, [
            ""
        ]), _define_property(_this, "status", void 0);
        _this.status = status;
        return _this;
    }
    return CustomError;
}(_wrap_native_super(Error));
var ErrorWithMessage = /*#__PURE__*/ function(CustomError) {
    "use strict";
    _inherits(ErrorWithMessage, CustomError);
    function ErrorWithMessage(status, message) {
        _class_call_check(this, ErrorWithMessage);
        var _this;
        _this = _call_super(this, ErrorWithMessage, [
            status
        ]);
        _this.message = message;
        return _this;
    }
    _create_class(ErrorWithMessage, [
        {
            key: "toJSON",
            value: function toJSON() {
                return {
                    status: this.status,
                    error: {
                        message: this.message
                    }
                };
            }
        }
    ]);
    return ErrorWithMessage;
}(CustomError);
/*

{
  email: "Wrong email format",
  password: "Not strong enough"
}

*/ // The error is used when the error of the system is caused by the incoming data from request body.
var FieldError = /*#__PURE__*/ function(CustomError) {
    "use strict";
    _inherits(FieldError, CustomError);
    function FieldError(fields) {
        _class_call_check(this, FieldError);
        var _this;
        _this = _call_super(this, FieldError, [
            StatusCodes.BAD_REQUEST
        ]), _define_property(_this, "fields", void 0);
        _this.fields = fields;
        return _this;
    }
    _create_class(FieldError, [
        {
            key: "toJSON",
            value: function toJSON() {
                return {
                    status: this.status,
                    error: {
                        fields: this.fields
                    }
                };
            }
        }
    ]);
    return FieldError;
}(CustomError);
export var createInternalServerError = function() {
    return new ErrorWithMessage(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error (Something wrong happened)");
};
export var createErrorWithMessage = function(status, message) {
    return new ErrorWithMessage(status, message);
};
export var createFieldError = function(fields) {
    return new FieldError(fields);
};
export var errorMiddleware = function(error, req, res, next) {
    console.error(error);
    if (_instanceof(error, CustomError)) {
        res.status(error.status).json(error.toJSON());
        return;
    }
    // Untuk error yang instancenya bukan yang CustomError (contoh Error instance dari JS)
    var defaultError = createErrorWithMessage(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    res.status(defaultError.status).json(defaultError.toJSON());
};
