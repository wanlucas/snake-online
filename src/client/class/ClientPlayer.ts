import Player, { Direction } from '../../class/Player';
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

		this.sprite = new Sprite('../sprites/snake-alt.png');

		this.sprite.addAnimation('head', [
			[196, 0, 56, 56],
		]);

		this.sprite.addAnimation('body', [
			[131, 61, 57, 57],
		]);

		this.sprite.addAnimation('right-turn', [
			[5, 69, 57, 57],
		]);

		this.sprite.addAnimation('left-turn', [
			[127, 132, 57, 57],
		]);

		this.sprite.addAnimation('tail', [
			[194, 127, 59, 59],
		]);
	}

	private getBodySprite(direction: Direction) {
		if (direction.length === 1) return 'body';
		if (['ur', 'rd', 'dl', 'lu'].includes(direction)) return 'right-turn';
		return 'left-turn';
	}

	public draw(context: CanvasRenderingContext2D) {
		this.sprite.setDirection(this.head.direction.at(-1) as Direction);
		this.sprite.draw('head', context, this.head.x, this.head.y, this.tileSize, this.tileSize);

		for (let i = this.body.length - 2; i > 0; i--) {
			const { x, y, direction } = this.body[i];

			this.sprite.setDirection(direction.at(-1) as Direction);

			this.sprite.draw(
				this.getBodySprite(direction),
				context,
				x, y,
				this.tileSize,
				this.tileSize
			);
		}

		if (!this.tail) return;

		this.sprite.setDirection(this.tail.direction.at(-1) as Direction);
		this.sprite.draw('tail', context, this.tail.x, this.tail.y, this.tileSize, this.tileSize);
	} 
}