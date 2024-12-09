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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
import { z } from "zod";
import { createErrorWithMessage, createFieldError } from "./error";
import { StatusCodes } from "http-status-codes";
export var withValidation = function(schemas, handler) {
    var bodySchema = schemas.bodySchema, paramsSchema = schemas.paramsSchema, querySchema = schemas.querySchema;
    return function(req, res, next) {
        try {
            // validation happens
            if (bodySchema !== undefined) {
                req.body = bodySchema.parse(req.body);
            }
            if (querySchema !== undefined) {
                req.query = querySchema.parse(req.query);
            }
            if (paramsSchema !== undefined) {
                req.params = paramsSchema.parse(req.params);
            }
            handler(req, res, next);
        } catch (error) {
            if (_instanceof(error, z.ZodError)) {
                var fields = error.errors.reduce(function(acc, param) {
                    var path = param.path, message = param.message;
                    return _object_spread_props(_object_spread({}, acc), _define_property({}, path.join("."), message));
                }, {});
                var response = {
                    status: 400,
                    error: fields
                };
                throw createFieldError(fields);
            }
            throw createErrorWithMessage(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    };
};
