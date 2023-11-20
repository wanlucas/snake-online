import { Position } from '../interface/entity';
import Tile from './Tile';

export type Direction = 'r' | 'l' | 'u' | 'd';

interface PlayerPayload {
	id: string;
	x: number;
	y: number;
	tileSize: number;
}
export default class Player {
	public id: string;
	public direction?: Direction;
	public tileSize: number = 5;
	public body: Tile[] = [];

	public velocity: {
    x: number;
    y: number;
  };

	constructor({ id, x, y, tileSize }: PlayerPayload) {
		this.id = id;
		this.body = [];
		this.tileSize = tileSize;
		this.velocity = {
			x: 0,
			y: 0,
		};

		this.addTileAt({ x, y });
	}

	get head() {
		return this.body[0];
	}

	get tail() {
		if (this.body.length === 1) return undefined;
		return this.body[this.body.length - 1];
	}

	public addTile() {
		const head = this.head;
		const tile = new Tile({
			x: head.x,
			y: head.y,
			size: this.tileSize,
		});

		this.body.unshift(tile);
	}

	public addTileAt({ x, y }: Position) {
		const tile = new Tile({ x, y, size: this.tileSize });
		this.body.unshift(tile);
	}

	public changeDirection(direction: Direction) {
		if (this.direction === 'r' && direction !== 'l'
		|| this.direction === 'l' && direction !== 'r'
		|| this.direction === 'u' && direction !== 'd'
		|| this.direction === 'd' && direction !== 'u'
		|| !this.direction
		) this.direction = direction;
	}

	public stepAt({ x, y }: Position) {
		this.addTileAt({ x, y });  
		this.body.pop();
	}

	private move() {
		if (!this.direction) return;

		switch (this.direction) {
		case 'r':
			this.velocity.x = this.tileSize;
			this.velocity.y = 0;
			break;
		case 'l':
			this.velocity.x = -this.tileSize;
			this.velocity.y = 0;
			break;
		case 'u':
			this.velocity.y = -this.tileSize;
			this.velocity.x = 0;
			break;
		case 'd':
			this.velocity.y = this.tileSize;
			this.velocity.x = 0;
			break;
		}

		this.stepAt({
			x: this.head.x + this.velocity.x,
			y: this.head.y + this.velocity.y,
		});
	}

	public update() {
		this.move();
	}
}