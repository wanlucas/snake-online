import Player from '../../class/Player';

export default class ClientPlayer extends Player {
	constructor(player: Player) {
		super(player.id, {
			tileSize: player.tileSize,
			initialPosition: player.body[0],
		});
	}

	public draw(context: CanvasRenderingContext2D) {
		context.fillStyle = 'white';

		for (let i = this.body.length - 1; i >= 0; i--) {
			const { x, y, isNew } = this.body[i];

			context.fillStyle = isNew ? 'red' : 'white';
			context.fillRect(
				x, y, 
				this.tileSize,
				this.tileSize,
			);
		}
	} 
}