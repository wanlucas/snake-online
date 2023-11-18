export type Direction = 'r' | 'l' | 'u' | 'd';

export interface Position {
	x: number;
	y: number;
}

export interface Tile extends Position {
	isNew?: boolean;
}

interface PlayerOptions {
  tileSize: number;
  initialPosition: {
    x: number;
    y: number;
  },
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

	constructor(id: string, options: PlayerOptions) {
		this.id = id;
		this.tileSize = options.tileSize;

		this.body.push({
			x: options.initialPosition.x,
			y: options.initialPosition.y,
		});

		this.velocity = {
			x: 0,
			y: 0,
		};
	}

	public addTile() {
		const head = this.body[0];

		this.body.unshift({
			...head,
			isNew: true,
		});
	}

	public changeDirection(direction: Direction) {
		if (this.direction === 'r' && direction !== 'l'
		|| this.direction === 'l' && direction !== 'r'
		|| this.direction === 'u' && direction !== 'd'
		|| this.direction === 'd' && direction !== 'u'
		|| !this.direction
		) this.direction = direction;
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

		this.body.unshift({ 
			x: this.body[0].x + this.velocity.x,
			y: this.body[0].y + this.velocity.y
		});

		this.body.pop();
	}

	public update() {
		this.move();
	}
}