import http from 'http';
import express from 'express';
import { startServer } from './server';

const app = express();
const PORT = 3001;
const server = http.createServer(app);

startServer(server, PORT);
