"use strict";
// otpStore.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeUsers = exports.otpStore = void 0;
// Create a Map to store OTPs
const otpStore = new Map();
exports.otpStore = otpStore;
const activeUsers = new Map();
exports.activeUsers = activeUsers;
