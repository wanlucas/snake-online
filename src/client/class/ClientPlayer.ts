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

		this.sprite = new Sprite('../sprites/snake.png');

		this.sprite.addAnimation('head', [
			[0, 0, 16, 16],
		]);

		this.sprite.addAnimation('body', [
			[16, 0, 16, 16],
			[32, 0, 16, 16],
			[16, 0, 16, 16]
		]);

		this.sprite.addAnimation('tail', [
			[48, 0, 16, 16],
		]);
	}

	public changeDirection(direction: Direction): void {
		super.changeDirection(direction);
		this.sprite.setDirection(direction);
	}

	public draw(context: CanvasRenderingContext2D) {
		context.fillStyle = 'white';
		
		this.sprite.draw('head', context, this.head.x, this.head.y, this.tileSize, this.tileSize);

		for (let i = this.body.length - 2; i > 0; i--) {
			const { x, y } = this.body[i];

			this.sprite.draw('body', context, x, y, this.tileSize, this.tileSize);
		}

		if (!this.tail) return;

		this.sprite.draw('tail', context, this.tail.x, this.tail.y, this.tileSize, this.tileSize);
	} 
}