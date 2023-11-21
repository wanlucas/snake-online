import { Direction } from '../../class/Player';
import Animation, { Slice } from './Animation';

export default class Sprite {
	public slices: Record<string, Animation>;
	private image: HTMLImageElement;
	private direction: Direction = 'u';

	constructor(src: string) {
		const image = new Image();
		image.src = src;

		image.onerror = () =>{
			throw new Error(`Error loading image: ${src}`);
		};

		this.image = image;
		this.slices = {};
	}

	private get angle() {
		switch (this.direction) {
		case 'r':
			return 90;
		case 'l':
			return -90;
		case 'd':
			return 180;
		default:
			return 0;
		}
	}

	public setDirection(direction: Direction) {
		this.direction = direction;
	}

	public addAnimation(name: string, slices: Slice[]) {
		this.slices[name] = new Animation(this.image, slices);
	}

	public draw(name: string, context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
		this.slices[name].draw(context, x, y, width, height, this.angle);
	}
}