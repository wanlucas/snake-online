import Fruit from '../../class/Fruit';
import Player, { Direction } from '../../class/Player';
import { Events, NewFruitPayload, NewPlayerPayload, PreloadPayload, TickPayload } from '../../interface/event';
import ClientFruit from './ClientFruit';
import ClientPlayer from './ClientPlayer';
import io, { Socket } from 'socket.io-client';

export interface ClientGameOptions {
  width: number;
  height: number;
}

export default class ClientGame {
	private context: CanvasRenderingContext2D;
	private width: number;
	private height: number;
	private io: Socket = io();
	private players: ClientPlayer[] = [];
	private fruits: ClientFruit[] = [];
	private localPlayer?: ClientPlayer;

	constructor(
		context: CanvasRenderingContext2D,
		options: ClientGameOptions,
	) { 
		this.context = context;
		this.width = options.width;
		this.height = options.height;
		this.start();
	}

	private addPlayer(player: Player) {
		const clientPLayer = new ClientPlayer(player);
		this.players.push(clientPLayer);
	}

	private removePlayer(id: string) {
		this.players = this.players.filter((player: ClientPlayer) => player.id !== id);
	}

	private addFruit(fruit: Fruit) {
		const clientFruit = new ClientFruit(fruit);
		this.fruits.push(clientFruit);
	}

	private onTick({ players }: { players: Player[] }) {
		this.players.forEach((player: ClientPlayer) => {
			const foundPlayer = players.find((p: Player) => p.id === player.id);

			if (!foundPlayer) return;

			player.body = foundPlayer.body;
			player.direction = foundPlayer.direction;
		});

		this.update();
	}

	private onPreload({ players, fruits }: PreloadPayload) {
		players.forEach((player: Player) => {
			this.addPlayer(player);

			if (player.id === this.io.id) {
				this.localPlayer = this.players[this.players.length - 1];
			}
		});

		fruits.forEach((fruit: Fruit) => {
			this.addFruit(fruit);
		});
	}
  
	private onNewPlayer(player: Player) {
		this.addPlayer(player);
	}

	private onRemovePlayer(id: string) {
		this.removePlayer(id);
	}

	private onNewFruit(fruit: NewFruitPayload) {
		this.addFruit(fruit);
	}

	private onRemoveFruit(id: number) {
		this.fruits = this.fruits.filter((fruit: ClientFruit) => fruit.id !== id);
	}

	public onInput(input: string, press: boolean) {
		if (!this.localPlayer) return;
    
		if (!press) return;

		switch (input) {
		case 'd':
			return this.emitChangeDirection('r');
		case 'a':
			return this.emitChangeDirection('l');
		case 'w':
			return this.emitChangeDirection('u');
		case 's':
			return this.emitChangeDirection('d');
		}
	}

	private emitChangeDirection(direction: Direction) {
		if (!this.localPlayer) return;
    
		this.localPlayer.direction = direction;
		this.io.emit(Events.ChangeDirection, direction);
	}

	private draw() {
		this.context.clearRect(0, 0, this.width, this.height);

		this.fruits.forEach((fruit: ClientFruit) => {
			fruit.draw(this.context);
		});

		this.players.forEach((player: ClientPlayer) => {
			player.draw(this.context);
		});
	}

	private update() {
		this.players.forEach((player: ClientPlayer) => {
			player.update();
		});

		this.draw();
	}

	public start() {
		this.io.on(Events.Preload, (data: PreloadPayload) => this.onPreload(data));
		this.io.on(Events.NewPlayer, (data: NewPlayerPayload) => this.onNewPlayer(data));
		this.io.on(Events.RemovePlayer, (id: string) => this.onRemovePlayer(id));
		this.io.on(Events.Tick, (data: TickPayload) => this.onTick(data));
		this.io.on(Events.NewFruit, (data: NewFruitPayload) => this.onNewFruit(data));
		this.io.on(Events.RemoveFruit, (id: number) => this.onRemoveFruit(id));
	}

	public stop() {
		this.io.disconnect();
	}
}