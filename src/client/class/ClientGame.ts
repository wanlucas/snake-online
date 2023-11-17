import Player from "../../class/Player";
import ClientPlayer from "./ClientPlayer";
import io, { Socket } from 'socket.io-client';

export interface ClientGameOptions {
  width: number;
  height: number;
}

export default class ClientGame {
  private context: CanvasRenderingContext2D;
  private io: Socket;
  private width: number;
  private height: number;
  private players: ClientPlayer[] = [];
  private localPlayer?: ClientPlayer;

  constructor(
    context: CanvasRenderingContext2D,
    options: ClientGameOptions,
  ) { 
    this.context = context;
    this.width = options.width || 800;
    this.height = options.height || 500;
    this.io = io();

    this.start();
  }

  private addPlayer(player: ClientPlayer) {
    console.log(player);
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
  };
  
  public onNewPlayer(player: Player) {
    this.addPlayer(new ClientPlayer(player));
  }

  public async start() {
    this.io.on('pleload', (data: any) => this.onPreload(data));
    this.io.on('new-player', (data: any) => this.onNewPlayer)
    this.io.on('tick', (data: any) => this.onTick(data));
  }

  private emitChangeDirection(direction: 'r' | 'l' | 'u' | 'd') {
    if (!this.localPlayer) return;

    this.localPlayer.direction = direction;
    this.io.emit('change-direction', direction);
  };

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
}