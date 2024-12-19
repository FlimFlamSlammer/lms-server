"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "subjectService", {
    enumerable: true,
    get: function() {
        return subjectService;
    }
});
var _prismaclient = require("../prisma-client");
var _nanoid = require("nanoid");
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
var prisma = _prismaclient.prismaInstance;
var SubjectService = /*#__PURE__*/ function() {
    "use strict";
    function SubjectService() {
        _class_call_check(this, SubjectService);
    }
    _create_class(SubjectService, [
        {
            key: "create",
            value: function create(data) {
                return prisma.subject.create({
                    data: _object_spread({
                        id: (0, _nanoid.nanoid)(),
                        status: "active"
                    }, data)
                });
            }
        },
        {
            key: "update",
            value: function update(id, data) {
                return prisma.subject.update({
                    where: {
                        id: id
                    },
                    data: _object_spread({}, data)
                });
            }
        },
        {
            key: "getAll",
            value: function getAll() {
                return prisma.subject.findMany();
            }
        },
        {
            key: "getById",
            value: function getById(id) {
                return prisma.subject.findFirst({
                    where: {
                        id: id
                    }
                });
            }
        }
    ]);
    return SubjectService;
}();
var subjectService = new SubjectService();
