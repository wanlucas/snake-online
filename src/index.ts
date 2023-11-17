import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import Game from './class/Game';

const app = express();
const server = http.createServer(app); 
const io = new Server(server);
const port = process.env.PORT || 8080;

const game = new Game(io);

app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', (socket: any) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Conectado na porta ${port}`);
});