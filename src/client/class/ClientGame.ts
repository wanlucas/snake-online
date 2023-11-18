import Player, { Direction } from '../../class/Player';
import { Events, NewPlayerPayload, PreloadPayload, TickPayload } from '../../interface/event';
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
	private localPlayer?: ClientPlayer;

	constructor(
		context: CanvasRenderingContext2D,
		options: ClientGameOptions,
	) { 
		this.context = context;
		this.width = options.width || 800;
		this.height = options.height || 500;
		this.start();
	}

	private addPlayer(player: Player) {
		const clientPLayer = new ClientPlayer(player);
		this.players.push(clientPLayer);
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

	private onPreload({ players }: { players: Player[] }) {
		players.forEach((player: Player) => {
			this.addPlayer(player);

			if (player.id === this.io.id) {
				this.localPlayer = this.players[this.players.length - 1];
			}
		});
	}
  
	private onNewPlayer(player: Player) {
		this.addPlayer(player);
	}

	public onInput(input: string, press: boolean) {
		if (!this.localPlayer) return;
    
		if (!press) return;
		console.log(input);
		switch (input) {
		case 'd':
			return this.emitChangeDirection('r');
		case 'a':
			return this.emitChangeDirection('l');
		case 'w':
			return this.emitChangeDirection('u');
		case 's':
			return this.emitChangeDirection('d');
		case 'f':
			return this.emitAddTile();
		}
	}

	private emitAddTile() {
		this.io.emit('add-tile');
	}

	private emitChangeDirection(direction: Direction) {
		if (!this.localPlayer) return;
    
		this.localPlayer.direction = direction;
		this.io.emit(Events.ChangeDirection, direction);
	}

	private draw() {
		this.context.clearRect(0, 0, this.width, this.height);

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
		this.io.on(Events.Tick, (data: TickPayload) => this.onTick(data));
	}

	public stop() {
		this.io.disconnect();
	}
}