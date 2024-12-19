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
    UserRoles: function() {
        return UserRoles;
    },
    validStatuses: function() {
        return validStatuses;
    },
    validUserRoles: function() {
        return validUserRoles;
    }
});
var validUserRoles = [
    "student",
    "teacher",
    "admin",
    "superadmin"
];
var validStatuses = [
    "active",
    "inactive"
];
var UserRoles = {
    STUDENT: validUserRoles[0],
    TEACHER: validUserRoles[1],
    ADMIN: validUserRoles[2],
    SUPERADMIN: validUserRoles[3]
};
