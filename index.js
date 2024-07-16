"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const apiSuosikit_1 = __importDefault(require("./routes/apiSuosikit"));
const apiAuth_1 = __importDefault(require("./routes/apiAuth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const portti = Number(process.env.PORT) || 3010;
app.use((0, cors_1.default)());
const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        jsonwebtoken_1.default.verify(token, String(process.env.ACCESS_TOKEN_KEY));
        next();
    }
    catch (error) {
        res.status(401).json({});
    }
};
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use("/api", apiAuth_1.default);
app.use("/api", checkToken, apiSuosikit_1.default);
app.listen((portti), () => {
    console.log(`Palvelin käynnistyi porttiin ${portti}`);
});
