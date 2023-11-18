import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import Game from './class/Game';
import config from './config';

const app = express();
const server = http.createServer(app); 
const io = new Server(server);
const port = process.env.PORT || 8080;

const game = new Game(io, {
	tileSize: 5,
	tickRate: 10,
	width: config.width,
	height: config.height,
});

app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', (req: Request, res: Response) => {
	return res.sendFile(path.join(__dirname, '../public/index.html'));
});

server.listen(port, () => {
	console.log(`Conectado na porta ${port}`);
});