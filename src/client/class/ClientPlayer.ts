import Player from "../../class/Player";

export default class ClientPlayer extends Player {
  constructor(player: Player) {
    super(player.id, {
      width: player.headW,
      height: player.headH,
      initialPosition: player.position,
    });
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'white';
    context.fillRect(
      this.position.x,
      this.position.y, 
      this.headW,
      this.headH,
    );
  } 
}