import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

const app = express();
const server = http.createServer(app); 
const io = new Server(server);
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, '/client/index.html'));
});

io.on('connection', (socket: any) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Conectado na porta ${port}`);
});