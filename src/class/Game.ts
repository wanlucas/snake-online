import { Server, Socket } from 'socket.io';
import Player, { Direction } from './Player';
import { Events } from '../interface/event';
import Fruit from './Fruit';
import config from '../config';
import Tile from './Tile';

interface GameConfig {
  tileSize: number;
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
  
	constructor (io: Server, config: GameConfig) {
		this.io = io;
		this.width = config.width;
		this.height = config.height;

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
		const { x, y } = this.randomPosition({
			entityW: config.player.size,
			entityH: config.player.size,
		});

		const player = new Player({ id, x, y, tileSize: config.tileSize });

		this.players.push(player);

		if (this.players.length === 1) this.start();

		return player;
	}

	private removePlayer(id: string) {
		this.players = this.players.filter((player: Player) => player.id !== id);

		this.emitRemovePlayer(id);

		if (!this.players.length) this.stop();
	}

	private killPlayer(player: Player) {
		this.removePlayer(player.id);
		this.emitRemovePlayer(player.id);
	}

	private addFruit() : Fruit{
		const id = this.fruits.length;
		const { size } = config.fruit;
		const { x, y } = this.randomPosition({
			entityW: config.fruit.size,
			entityH: config.fruit.size,
		});

		const fruit = new Fruit({ id, x, y, width: size, height: size });

		this.fruits.push(fruit);
		this.emitNewFruit(fruit);

		return fruit;
	}

	private removeFruit(id: number) {
		this.fruits = this.fruits.filter((fruit: Fruit) => fruit.id !== id);
		this.emitRemoveFruit(id);
	}



	private onDisconnect(id: string) {  
		console.log(`${id} disconnected!`);

		this.removePlayer(id);
	}

	private addListeners(socket: Socket) {
		socket.on(Events.Disconnect, () => this.onDisconnect(socket.id));
		socket.on(Events.PlayerMove, (direction: Direction) => this.onPlayerMove(socket, direction));
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
		this.emitGetFruit(player.id);
		this.removeFruit(fruit.id);
		this.addFruit();
	}

	private onPlayerMove(socket: Socket, direction: Direction) {
		const player = this.players.find((p: Player) => p.id === socket.id);
		
		if (!player) return;

		player.changeDirection(direction);
		player.update();

		this.emitPlayerUpdate(socket, player);

		if (player.head.x < 0) player.stepAt({ x: this.width - player.tileSize, y: player.head.y });
		if (player.head.x > this.width - player.tileSize) player.stepAt({ x: 0, y: player.head.y });
		if (player.head.y < 0) player.stepAt({ x: player.head.x, y: this.height - player.tileSize });
		if (player.head.y > this.height - player.tileSize) player.stepAt({ x: player.head.x, y: 0 });

		const collidedPlayer = this.players.find((p: Player) => (
			p.body.some((tile: Tile, i) => (
				i > 0 && tile.collidesWith(player.head)
			))
		));

		if (collidedPlayer) this.killPlayer(player);

		const collidedFruit = this.fruits.find((fruit: Fruit) => (
			fruit.collidesWith(player.head)
		));

		if (collidedFruit) this.onGetFruit(player, collidedFruit);
	}

	private emitPreload(socket: Socket) {
		socket.emit(Events.Preload, { 
			players: this.players,
			fruits: this.fruits,
		});
	}

	private emitNewFruit(fruit: Fruit) {
		this.io.emit(Events.NewFruit, fruit);
	}

	private emitGetFruit(playerId: string) {
		this.io.to(playerId).emit(Events.GetFruit);
	}

	private emitRemoveFruit(id: number) {
		this.io.emit(Events.RemoveFruit, id);
	}

	private emitRemovePlayer(id: string) {
		this.io.emit(Events.RemovePlayer, id);
	}

	private emitPlayerUpdate(socket: Socket, player: Player) {
		socket.broadcast.emit(Events.PlayerMove, player);
	}

	public start() {		
		this.addFruit();

		console.log('Game started!');
	}

	public stop() {
		clearInterval(this.tickInterval);
		this.fruits = [];
		this.players = [];

		console.log('Game stopped!');
	}
}