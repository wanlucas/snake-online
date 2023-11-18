import { Server, Socket } from 'socket.io';
import Player, { Direction } from './Player';
import { ChangeDirectionPayload } from '../interface/event';
import { Events } from '../interface/event';
import Fruit from './Fruit';
import Collision from '../utils/Collision';

interface GameConfig {
  tileSize: number;
  tickRate: number;
}

export default class Game {
	private io: Server;
	private width: number = 800;
	private height: number = 500;
	private players: Player[] = [];
	private fruits: Fruit[] = [];
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

	private addPlayer(id: string): Player {
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

	private addFruit() : Fruit{
		const id = this.fruits.length;
		const position = this.randomPosition({
			entityW: this.config.tileSize,
			entityH: this.config.tileSize,
		});

		const fruit = new Fruit(id, position);

		this.fruits.push(fruit);
		this.emitNewFruit(fruit);

		return fruit;
	}

	private removeFruit(id: number) {
		this.fruits = this.fruits.filter((fruit: Fruit) => fruit.id !== id);
		this.emitRemoveFruit(id);
	}

	private addTile(id: string) {
		const player = this.players.find((player: Player) => player.id === id);
		player && player.addTile();
	}

	private onChangeDirection(socket: Socket, direction: Direction) {
		const player = this.players.find((p: Player) => p.id === socket.id);
		if (!player) return;
		player.changeDirection(direction);
	}

	private onDisconnect(id: string) {  
		console.log(`${id} disconnected!`);
	}

	private addListeners(socket: Socket) {
		socket.on(Events.Disconnect, () => this.onDisconnect(socket.id));
		socket.on(Events.ChangeDirection, (data: ChangeDirectionPayload) => this.onChangeDirection(socket, data));
		socket.on('add-tile', () => this.addTile(socket.id));
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
		this.io.on(Events.Connect, (socket: Socket) => this.onConnect(socket));
		
		this.addFruit();
		this.tickInterval = setInterval(() => {
			this.emitTick();
			this.update();
		}, 1000 / this.config.tickRate);
	}

	public stop() {
		clearInterval(this.tickInterval);
	}
}