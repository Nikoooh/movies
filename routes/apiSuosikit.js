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
const suosikitRoute = express_1.default.Router();
const prisma = new client_1.PrismaClient();
suosikitRoute.use(express_1.default.json());
suosikitRoute.post("/suosikit", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield prisma.elokuva.findFirst({
        where: {
            elokuvaId: Number(req.body.id),
            kayttajaId: Number(req.body.kayttajaId)
        }
    })) {
        res.status(400).json({});
    }
    else {
        try {
            let isMovie = false;
            if (req.body.title) {
                isMovie = true;
            }
            yield prisma.elokuva.create({
                data: {
                    kayttajaId: Number(req.body.kayttajaId),
                    elokuvaId: Number(req.body.id),
                    title: req.body.name || req.body.title,
                    overview: req.body.overview,
                    release_date: req.body.release_date || req.body.first_air_date,
                    vote_average: String(req.body.vote_average),
                    vote_count: String(req.body.vote_count),
                    poster_path: req.body.poster_path,
                    isMovie: isMovie
                }
            });
        }
        catch (e) {
            res.status(500).json({});
        }
    }
    ;
}));
suosikitRoute.get("/suosikit/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suosikit = yield prisma.elokuva.findMany({
            where: {
                kayttajaId: Number(req.params.id)
            }
        });
        if (suosikit.length > 0) {
            res.status(200).json(suosikit);
        }
        else {
            res.status(404).json({});
        }
    }
    catch (error) {
        res.status(500).json({});
    }
}));
exports.default = suosikitRoute;
