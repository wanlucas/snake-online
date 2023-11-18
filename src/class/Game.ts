import { Server, Socket } from 'socket.io';
import Player, { Direction } from './Player';
import { ChangeDirectionPayload } from '../interface/event';
import { Events } from '../interface/event';
import Fruit from './Fruit';
import Collision from '../utils/Collision';
import config from '../config';

interface GameConfig {
  tileSize: number;
  tickRate: number;
	width: number;
	height: number;
}

export default class Game {
	private io: Server;
	private width: number;
	private height: number;
	private players: Player[] = [];
	private fruits: Fruit[] = [];
	private tickInterval?: NodeJS.Timeout;
	private config: {
		tickRate: number;
	};
  
	constructor (io: Server, config: GameConfig) {
		this.io = io;
		this.width = config.width;
		this.height = config.height;
		this.config = {
			tickRate: config.tickRate,
		};

		this.io.on(
			Events.Connect, 
			(socket: Socket) => this.onConnect(socket)
		);
	}

	private randomPosition({ entityW, entityH }: { entityW: number, entityH: number } = {
		entityW: 0,
		entityH: 0,
	}) {
		return {
			x: Math.floor(Math.random() * (this.width - entityW) / config.tileSize) * config.tileSize,
			y: Math.floor(Math.random() * (this.height - entityH) / config.tileSize) * config.tileSize,
		};
	}

	private addPlayer(id: string): Player {
		const player = new Player(id, {
			initialPosition: this.randomPosition({
				entityW: config.player.size,
				entityH: config.player.size,
			}),
			tileSize: config.player.size,
		});

		this.players.push(player);

		if (this.players.length === 1) this.start();

		return player;
	}

	private removePlayer(id: string) {
		this.players = this.players.filter((player: Player) => player.id !== id);

		this.emitRemovePlayer(id);

		if (!this.players.length) this.stop();
	}

	private addFruit() : Fruit{
		const id = this.fruits.length;
		const position = this.randomPosition({
			entityW: config.fruit.size,
			entityH: config.fruit.size,
		});

		const fruit = new Fruit(id, position, {
			size: config.fruit.size,
		});

		this.fruits.push(fruit);
		this.emitNewFruit(fruit);

		return fruit;
	}

	private removeFruit(id: number) {
		this.fruits = this.fruits.filter((fruit: Fruit) => fruit.id !== id);
		this.emitRemoveFruit(id);
	}

	private onChangeDirection(socket: Socket, direction: Direction) {
		const player = this.players.find((p: Player) => p.id === socket.id);
		if (!player) return;
		player.changeDirection(direction);
	}

	private onDisconnect(id: string) {  
		console.log(`${id} disconnected!`);

		this.removePlayer(id);
	}

	private addListeners(socket: Socket) {
		socket.on(Events.Disconnect, () => this.onDisconnect(socket.id));
		socket.on(Events.ChangeDirection, (data: ChangeDirectionPayload) => this.onChangeDirection(socket, data));
	}

	private onConnect(socket: Socket) {
		console.log(`${socket.id} connected!`);
    
		const player = this.addPlayer(socket.id);
		this.addListeners(socket);

		this.emitPreload(socket);
		socket.broadcast.emit(Events.NewPlayer, player);
	}

	private onGetFruit(player: Player, fruit: Fruit) {
		player.addTile();
		this.removeFruit(fruit.id);
		this.addFruit();
	}

	private emitRemovePlayer(id: string) {
		this.io.emit(Events.RemovePlayer, id);
	}

	private emitPreload(socket: Socket) {
		socket.emit(Events.Preload, { 
			players: this.players,
			fruits: this.fruits,
		});
	}

	private emitTick() {
		this.io.emit(Events.Tick, {
			players: this.players,
		});
	}

	private emitNewFruit(fruit: Fruit) {
		this.io.emit(Events.NewFruit, fruit);
	}

	private emitRemoveFruit(id: number) {
		this.io.emit(Events.RemoveFruit, id);
	}

	private update() {
		this.players.forEach((player: Player) => {
			player.update();

			if (player.head.x < 0) player.step({ x: this.width - player.tileSize, y: player.head.y });
			if (player.head.x > this.width - player.tileSize) player.step({ x: 0, y: player.head.y });
			if (player.head.y < 0) player.step({ x: player.head.x, y: this.height - player.tileSize });
			if (player.head.y > this.height - player.tileSize) player.step({ x: player.head.x, y: 0 });

			const collidesWith = this.fruits.find((fruit: Fruit) =>(
				Collision.rectToRect({
					x: player.head.x,
					y: player.head.y,
					w: player.tileSize,
					h: player.tileSize,
				}, {
					x: fruit.position.x,
					y: fruit.position.y,
					w: fruit.size,
					h: fruit.size,
				})
			));

			if (collidesWith) this.onGetFruit(player, collidesWith);
		});
	}

	public start() {		
		this.addFruit();
		this.tickInterval = setInterval(() => {
			this.emitTick();
			this.update();
		}, 1000 / this.config.tickRate);

		console.log('Game started!');
	}

	public stop() {
		clearInterval(this.tickInterval);
		this.fruits = [];
		this.players = [];

		console.log('Game stopped!');
	}
}