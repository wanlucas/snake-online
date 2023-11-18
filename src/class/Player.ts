export type Direction = 'r' | 'l' | 'u' | 'd';

interface PlayerOptions {
  width: number;
  height: number;
  initialPosition: {
    x: number;
    y: number;
  },
}


export default class Player {
	public id: string;
	public headW: number;
	public headH: number;
	public direction?: Direction;

	public position: {
    x: number;
    y: number;
  };

	public velocity: {
    x: number;
    y: number;
  };

	constructor(id: string, options: PlayerOptions) {
		this.id = id;
		this.headW = options.width;
		this.headH = options.height;

		this.position = {
			x: options.initialPosition.x,
			y: options.initialPosition.y,
		};

		this.velocity = {
			x: 0,
			y: 0,
		};
	}

	private move() {
		switch (this.direction) {
		case 'r':
			this.velocity.x = 1;
			this.velocity.y = 0;
			break;
		case 'l':
			this.velocity.x = -1;
			this.velocity.y = 0;
			break;
		case 'u':
			this.velocity.y = -1;
			this.velocity.x = 0;
			break;
		case 'd':
			this.velocity.y = 1;
			this.velocity.x = 0;
			break;
		}

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}

	public update() {
		this.move();
	}
}