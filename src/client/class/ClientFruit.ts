import Fruit, { FruitPayload } from '../../class/Fruit';

interface ClientFruitPayload extends FruitPayload {
	color?: string;
}

export default class ClientFruit extends Fruit {
	public color: string;

	constructor({ color = 'green', ...fruit }: ClientFruitPayload) {
		super(fruit);
		this.color = color;
	}

	public draw(context: CanvasRenderingContext2D) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}