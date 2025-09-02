"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const isLogged = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }
        const decoded_data = jsonwebtoken_1.default.verify(token, process.env.SECRET_CODE); // cast to any to skip strict typing
        if (!decoded_data) {
            return res.status(403).json({
                message: "Token expired or invalid",
            });
        }
        const user = yield client.user.findUnique({
            where: { Email: decoded_data.email },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        req.USER = user;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Please login again",
        });
    }
});
exports.default = isLogged;
