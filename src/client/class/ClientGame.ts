import Game from "../../class/Game";
import ClientPlayer from "./ClientPlayer";
import { io, Socket } from "socket.io-client";

export interface ClientGameOptions {
  width: number;
  height: number;
}

export default class ClientGame extends Game {
  private context: CanvasRenderingContext2D;
  private io: Socket;
  private width: number;
  private height: number;
  private players: ClientPlayer[] = [];

  constructor(
    context: CanvasRenderingContext2D,
    options: ClientGameOptions,
  ) { 
    super();

    this.context = context;
    this.width = options.width || 800;
    this.height = options.height || 500;
    this.io = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: '/api/socket/io',
      // transports: ['websocket'],
      addTrailingSlash: false,
    })
  }
  
  public async start() {
    this.io.on('connect', () => {
      console.log('Connected to server');
    })
  }
}