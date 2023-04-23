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
const http_1 = require("http");
const ws_1 = require("ws");
const openai_1 = require("openai");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
server.listen(3001, () => console.log('Server listening on port 3001'));
const wss = new ws_1.Server({ server });
require('dotenv').config();
console.log(process.env.OPENAI_ORGANIZATION_ID);
console.log(process.env.OPENAI_API_KEY);
const chatGptApi = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const configuration = new openai_1.Configuration({
        organization: process.env.OPENAI_ORGANIZATION_ID,
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new openai_1.OpenAIApi(configuration);
    const completion = yield openai.createCompletion({
        model: 'text-davinci-003',
        prompt: message,
    });
    console.log(completion.data.choices[0].text);
    return completion.data.choices[0].text;
});
wss.on('connection', (ws) => {
    console.log('WebSocket connected');
    ws.on('message', (messageJson) => __awaiter(void 0, void 0, void 0, function* () {
        const message = JSON.parse(messageJson);
        console.log(`Received: ${message.content}`);
        const gptResponse = yield chatGptApi(message.content);
        ws.send(JSON.stringify({ author: 'ChatGPT', content: gptResponse }));
    }));
    ws.on('close', () => {
        console.log('WebSocket disconnected');
    });
});
//# sourceMappingURL=server.js.map