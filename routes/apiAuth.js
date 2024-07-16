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
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiAuth = express_1.default.Router();
const prisma = new client_1.PrismaClient();
apiAuth.use(express_1.default.json());
apiAuth.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const kayttaja = yield prisma.kayttaja.findFirst({
            where: {
                kayttajatunnus: req.body.kayttajatunnus
            }
        });
        if (!kayttaja) {
            let hash = crypto_1.default.createHash("SHA512").update(req.body.salasana).digest("hex");
            yield prisma.kayttaja.create({
                data: {
                    kayttajatunnus: req.body.kayttajatunnus,
                    salasana: hash
                }
            });
            res.status(200).json({});
        }
        else {
            res.status(400).json({});
        }
    }
    catch (e) {
        res.status(500).json({});
    }
}));
apiAuth.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const kayttaja = yield prisma.kayttaja.findFirst({
            where: {
                kayttajatunnus: req.body.kayttajatunnus
            }
        });
        if (kayttaja) {
            let hash = crypto_1.default.createHash("SHA512").update(req.body.salasana).digest("hex");
            if (kayttaja.salasana === hash) {
                let token = jsonwebtoken_1.default.sign({}, String(process.env.ACCESS_TOKEN_KEY));
                res.status(200).json({ id: kayttaja.id, token: token });
            }
            else {
                res.status(401).json({});
            }
        }
        else {
            res.status(401).json({});
        }
    }
    catch (e) {
        res.status(500).json({});
    }
}));
exports.default = apiAuth;
