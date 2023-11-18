import { Server, Socket } from 'socket.io';
import Player, { Direction } from './Player';
import { ChangeDirectionPayload } from '../interface/event';
import { Events } from '../interface/event';

interface GameConfig {
  tileSize: number;
  tickRate: number;
}

export default class Game {
	private io: Server;
	private width: number = 800;
	private height: number = 500;
	private players: Player[] = [];
	private tickInterval?: NodeJS.Timeout;
	private config: GameConfig = {
		tileSize: 15,
		tickRate: 10,
	};
  
	constructor (io: Server) {
		this.io = io;
		this.start();
	}

	private randomPosition({ entityW, entityH }: { entityW: number, entityH: number } = {
		entityW: 0,
		entityH: 0,
	}) {
		return {
			x: Math.floor(Math.random() * (this.width - entityW)),
			y: Math.floor(Math.random() * (this.height - entityH)),
		};
	}

	public addPlayer(id: string): Player {
		const player = new Player(id, {
			initialPosition: this.randomPosition({
				entityW: this.config.tileSize,
				entityH: this.config.tileSize,
			}),
			tileSize: this.config.tileSize
		});

		this.players.push(player);

		return player;
	}

	public addTile(id: string) {
		const player = this.players.find((player: Player) => player.id === id);
		player && player.addTile();
	}

	private onMove(socket: Socket, direction: Direction) {
		const player = this.players.find((p: Player) => p.id === socket.id);
		if (!player) return;
		player.direction = direction;
	}

	private onDisconnect(id: string) {  
		console.log(`${id} disconnected!`);
	}

	private addListeners(socket: Socket) {
		socket.on(Events.Disconnect, () => this.onDisconnect(socket.id));
		socket.on(Events.ChangeDirection, (data: ChangeDirectionPayload) => this.onMove(socket, data));
		socket.on('add-tile', () => this.addTile(socket.id));
	}

	private onConnect(socket: Socket) {
		console.log(`${socket.id} connected!`);
    
		const player = this.addPlayer(socket.id);
		this.addListeners(socket);

		socket.emit(Events.Preload, { players: this.players });
		socket.broadcast.emit(Events.NewPlayer, player);
	}

	public emitTick() {
		this.io.emit(Events.Tick, {
			players: this.players,
		});
	}

	private update() {
		this.players.forEach((player: Player) => player.update());
	}

	public start() {
		this.io.on(Events.Connect, (socket: Socket) => this.onConnect(socket));

		this.tickInterval = setInterval(() => {
			this.emitTick();
			this.update();
		}, 1000 / this.config.tickRate);
	}

	public stop() {
		clearInterval(this.tickInterval);
	}
}