"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromRequest = exports.attachUserToRequest = void 0;
// Attach a user to the request object
const attachUserToRequest = (req, user) => {
    // @ts-ignore
    req.user = user;
};
exports.attachUserToRequest = attachUserToRequest;
// Retrieve the user from the request object
const getUserFromRequest = (req) => {
    // @ts-ignore
    return req.user;
};
exports.getUserFromRequest = getUserFromRequest;
