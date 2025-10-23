"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const createLogger = ({ level, isDev }) => (0, pino_1.default)({
    level,
    redact: ['req.headers.authorization'],
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    ...(isDev && { transport: { target: 'pino-pretty' } }),
});
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map