"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateIva = void 0;
const calculateIva = (value) => {
    const ivaRate = 0.23; // 23% IVA rate
    return value * (1 + ivaRate);
};
exports.calculateIva = calculateIva;
