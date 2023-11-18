import { Server, Socket } from 'socket.io';
import Player, { Direction } from './Player';
import { ChangeDirectionPayload } from '../interface/event';
import { Events } from '../interface/event';

interface GameConfig {
  playerW: number;
  playerH: number;
  tickRate: number;
}

export default class Game {
	private io: Server;
	private width: number = 800;
	private height: number = 500;
	private players: Player[] = [];
	private tickInterval?: NodeJS.Timeout;
	private config: GameConfig = {
		playerW: 10,
		playerH: 10,
		tickRate: 30,
	};
  
	constructor (io: Server) {
		this.io = io;
		this.start();
	}

	private sortPosition({ entityW, entityH }: { entityW: number, entityH: number } = {
		entityW: 0,
		entityH: 0,
	}) {
		return {
			x: Math.floor(Math.random() * (this.width - entityW)),
			y: Math.floor(Math.random() * (this.height - entityH)),
		};
	}

	public addPlayer(player: Player) {
		this.players.push(player);
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
	}

	private onConnect(socket: Socket) {
		console.log(`${socket.id} connected!`);

		const player = new Player(socket.id, {
			initialPosition: this.sortPosition({
				entityW: this.config.playerW,
				entityH: this.config.playerH,
			}),
			width: this.config.playerW,
			height: this.config.playerH,
		});
    
		this.addPlayer(player);
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

		this.update();
		this.tickInterval = setInterval(() => {
			this.emitTick();
		}, 1000 / this.config.tickRate);

		setInterval(() => {
			this.update();
		}, 1000 / 60);
	}

	public stop() {
		clearInterval(this.tickInterval);
	}
}