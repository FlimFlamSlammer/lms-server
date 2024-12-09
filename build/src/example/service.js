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
var ExampleService = /*#__PURE__*/ function() {
    "use strict";
    function ExampleService() {
        _class_call_check(this, ExampleService);
    }
    _create_class(ExampleService, [
        {
            key: "list",
            value: function list() {
                return [];
            }
        }
    ]);
    return ExampleService;
}();
export var exampleService = new ExampleService();
