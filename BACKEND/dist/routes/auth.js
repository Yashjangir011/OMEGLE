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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generatetoken_js_1 = __importDefault(require("../utils/generatetoken.js"));
const isLogged_js_1 = __importDefault(require("../middleware/isLogged.js"));
const router = express_1.default.Router();
const client = new client_1.PrismaClient();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, sex, age, state } = req.body;
        if (!username || !password || !email || !sex || !age || !state) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // if we are using findunique than that field also considered to be unique inside the model else it gave us error
        const check_for_banned_email = yield client.block.findUnique({
            where: {
                Email: email
            }
        });
        if (check_for_banned_email) {
            return res.status(400).json({
                success: false,
                message: "Email is banned"
            });
        }
        const exist_user_check = yield client.user.findUnique({
            where: {
                Email: email
            }
        });
        if (exist_user_check) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        (0, generatetoken_js_1.default)(email, res);
        const user_Created = yield client.user.create({
            data: {
                Username: username,
                Password: hashPassword,
                Email: email,
                Sex: sex,
                Age: age,
                State: state
            }
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user_Created.id,
                username: user_Created.Username,
                email: user_Created.Email,
                sex: user_Created.Sex,
                age: user_Created.Age,
                state: user_Created.State
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const existing_user = yield client.user.findUnique({
            where: {
                Email: email
            }
        });
        if (!existing_user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }
        const isMatch = yield bcrypt_1.default.compare(password, existing_user.Password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        (0, generatetoken_js_1.default)(email, res);
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: existing_user.id,
                username: existing_user.Username,
                email: existing_user.Email,
                sex: existing_user.Sex,
                age: existing_user.Age,
                state: existing_user.State
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}));
router.get('/logout', isLogged_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0), // set expiration to past date to clear cookie
        });
        res.status(200).json({
            message: "Logout successful",
        });
    }
    catch (error) {
        res.status(200).json({
            messagae: "internal server error",
        });
    }
}));
exports.default = router;
