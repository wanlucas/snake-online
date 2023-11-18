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

	private addPlayer(player: ClientPlayer) {
		this.players.push(player);
	}

	private onPreload({ players }: { players: Player[] }) {
		players.forEach((player: Player) => {
			this.addPlayer(new ClientPlayer(player));

			if (player.id === this.io.id) {
				this.localPlayer = this.players[this.players.length - 1];
			}
		});
	}

	private onTick({ players }: { players: Player[] }) {
		this.players.forEach((player: ClientPlayer) => {
			const foundPlayer = players.find((p: Player) => p.id === player.id);

			if (!foundPlayer) return;

			player.position = foundPlayer.position;
			player.direction = foundPlayer.direction;
		});

		this.update();
		this.draw();
	}
  
	private onNewPlayer(player: Player) {
		this.addPlayer(new ClientPlayer(player));
	}

	public onInput(input: string, press: boolean) {
		if (!this.localPlayer) return;
    
		if (!press) return;
    
		switch (input) {
		case 'd':
			this.emitChangeDirection('r');
			break;
		case 'a':
			this.emitChangeDirection('l');
			break;
		case 'w':
			this.emitChangeDirection('u');
			break;
		case 's':
			this.emitChangeDirection('d');
			break;
		}
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