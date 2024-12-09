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
import { prismaInstance } from "../prisma-client";
var prisma = prismaInstance;
var UserService = /*#__PURE__*/ function() {
    "use strict";
    function UserService() {
        _class_call_check(this, UserService);
    }
    _create_class(UserService, [
        {
            key: "getByEmail",
            value: function getByEmail(email) {
                return prisma.user.findFirst({
                    where: {
                        email: email
                    }
                });
            }
        },
        {
            key: "getById",
            value: function getById(id) {
                return prisma.user.findFirst({
                    where: {
                        id: id
                    }
                });
            }
        }
    ]);
    return UserService;
}();
export var userService = new UserService();
