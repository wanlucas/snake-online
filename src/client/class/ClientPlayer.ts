import Player from "../../class/Player";

export default class ClientPlayer extends Player {
  public position: {
    x: number;
    y: number;
  };

  public width: number;
  public height: number;

  constructor() {
    super();

    this.position = {
      x: 0,
      y: 0,
    };

    this.width = 10;
    this.height = 10;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillRect(
      this.position.x,
      this.position.y, 
      this.width,
      this.height
    );
  } 
}