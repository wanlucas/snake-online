import Fruit from '../../class/Fruit';
import Player from '../../class/Player';
import { Events, NewFruitPayload, NewPlayerPayload, PreloadPayload } from '../../interface/event';
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
	public latency: number = 0;
	private localUpdateInt?: NodeJS.Timeout;

	constructor(
		context: CanvasRenderingContext2D,
		options: ClientGameOptions,
	) { 
		this.context = context;
		this.width = options.width;
		this.height = options.height;
		this.open();
	}

	private addPlayer(player: Player) {
		const clientPLayer = new ClientPlayer(player);
		this.players.push(clientPLayer);
	}
	
	private setLocalPlayer(player: Player) {
		this.localPlayer = new ClientPlayer(player);
	}

	private removePlayer(id: string) {
		this.players = this.players.filter((player: ClientPlayer) => player.id !== id);
	}

	private removeLocalPlayer() {
		clearInterval(this.localUpdateInt);
		this.localUpdateInt = undefined;
		this.localPlayer = undefined;
	}

	private addFruit(fruit: Fruit) {
		const clientFruit = new ClientFruit(fruit);
		this.fruits.push(clientFruit);
	}

	private onPreload({ players, fruits }: PreloadPayload) {
		players.forEach((player: Player) => {
			if (player.id === this.io.id) this.setLocalPlayer(player);
			else this.addPlayer(player);
		});

		fruits.forEach((fruit: Fruit) => {
			this.addFruit(fruit);
		});

		this.start();
	}

	private onNewPlayer(player: Player) {
		this.addPlayer(player);
	}

	private onRemovePlayer(id: string) {
		if (id === this.io.id) this.removeLocalPlayer();
		else this.removePlayer(id);
	}

	private onPlayerMove(player: Player) {
		const foundPlayer = this.players.find((p: ClientPlayer) => p.id === player.id);

		if (!foundPlayer) return;

		foundPlayer.body = player.body;
		foundPlayer.direction = player.direction;
	}

	private onGetFruit() {
		this.localPlayer!.addTile();
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
			return this.localPlayer.changeDirection('r');
		case 'a':
			return this.localPlayer.changeDirection('l');
		case 'w':
			return this.localPlayer.changeDirection('u');
		case 's':
			return this.localPlayer.changeDirection('d');
		}
	}

	private emitMove() {
		this.io.emit(Events.PlayerMove, this.localPlayer!.direction);
	}

	private draw() {
		this.context.clearRect(0, 0, this.width, this.height);

		this.context.font = '12px serif';
		this.context.fillStyle = 'green';
		this.context.fillText(String(this.latency), 10, 20);

		this.fruits.forEach((fruit: ClientFruit) => {
			fruit.draw(this.context);
		});

		this.players.forEach((player: ClientPlayer) => {
			player.draw(this.context);
		});

		if (!this.localPlayer) return;

		this.localPlayer.draw(this.context);
	}

	private updateLocalPlayer() {
		// TODO - Remover !
		const player = this.localPlayer!;

		player.update();
		this.emitMove();

		if (player.head.x < 0) player.stepAt({ x: this.width - player.tileSize, y: player.head.y });
		if (player.head.x > this.width - player.tileSize) player.stepAt({ x: 0, y: player.head.y });
		if (player.head.y < 0) player.stepAt({ x: player.head.x, y: this.height - player.tileSize });
		if (player.head.y > this.height - player.tileSize) player.stepAt({ x: player.head.x, y: 0 });
	}

	public open() {
		this.io.connect();

		this.io.on(Events.Preload, (data: PreloadPayload) => this.onPreload(data));
		this.io.on(Events.NewPlayer, (data: NewPlayerPayload) => this.onNewPlayer(data));
		this.io.on(Events.RemovePlayer, (id: string) => this.onRemovePlayer(id));
		this.io.on(Events.NewFruit, (data: NewFruitPayload) => this.onNewFruit(data));
		this.io.on(Events.RemoveFruit, (id: number) => this.onRemoveFruit(id));
		this.io.on(Events.PlayerMove, (data: Player) => this.onPlayerMove(data));
		this.io.on(Events.GetFruit, () => this.onGetFruit());
	}

	public start() {
		if (!this.localPlayer) return;

		this.localUpdateInt = setInterval(() => {
			this.updateLocalPlayer();
		}, 1000 / 15);

		setInterval(() => {
			this.draw();
		}, 1000 / 60);
	}
}