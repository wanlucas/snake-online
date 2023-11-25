import Player, { Direction } from '../../class/Player';
import Tile from '../../class/Tile';
import Sprite from './Sprite';

export default class ClientPlayer extends Player {
	private sprite: Sprite;

	constructor(player: Player) {
		super({
			id: player.id,
			tileSize: player.tileSize,
			x: player.body[0].x,
			y	: player.body[0].y,
		});

		this.sprite = new Sprite('../sprites/snake-green.png');

		this.sprite.addAnimation('head', [
			[0, 0, 148, 150, 2],
			[0, 150, 148, 150, 10],
		]);

		this.sprite.addAnimation('body', [
			[0, 300, 148, 150],
		]);

		this.sprite.addAnimation('buxin', [
			[0, 450, 148, 150],
		]);

		this.sprite.addAnimation('right-turn', [
			[0, 600, 148, 150],
		]);

		this.sprite.addAnimation('left-turn', [
			[0, 750, 148, 150],
		]);

		this.sprite.addAnimation('tail', [
			[0, 900, 148, 150],
		]);
	}

	private getBodySprite({ direction, newTile }: Tile) {
		if (direction.length === 1) return newTile ? 'buxin' : 'body';
		if (['ur', 'rd', 'dl', 'lu'].includes(direction)) return 'right-turn';

		return 'left-turn';
	}

	public draw(context: CanvasRenderingContext2D) {
		this.sprite.setDirection(this.head.direction.at(-1) as Direction);
		this.sprite.draw('head', context, this.head.x, this.head.y, this.tileSize, this.tileSize);

		for (let i = this.body.length - 2; i > 0; i--) {
			const current = this.body[i];

			this.sprite.setDirection(current.direction.at(-1) as Direction);

			this.sprite.draw(
				this.getBodySprite(current),
				context,
				current.x, current.y,
				this.tileSize,
				this.tileSize
			);
		}

		if (!this.tail) return;

		this.sprite.setDirection(this.tail.direction.at(-1) as Direction);
		this.sprite.draw('tail', context, this.tail.x, this.tail.y, this.tileSize, this.tileSize);
	} 
}