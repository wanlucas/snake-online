import Player from '../../class/Player';

export default class ClientPlayer extends Player {
	constructor(player: Player) {
		super({
			id: player.id,
			tileSize: player.tileSize,
			x: player.body[0].x,
			y	: player.body[0].y,
		});
	}

	public draw(context: CanvasRenderingContext2D) {
		context.fillStyle = 'white';

		for (let i = this.body.length - 1; i >= 0; i--) {
			const { x, y } = this.body[i];

			context.fillRect(
				x, y, 
				this.tileSize,
				this.tileSize,
			);
		}
	} 
}