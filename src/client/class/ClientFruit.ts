import Fruit, { FruitPayload } from '../../class/Fruit';
import Sprite from './Sprite';

interface ClientFruitPayload extends FruitPayload { }

export default class ClientFruit extends Fruit {
	private sprite: Sprite;

	constructor(fruit: ClientFruitPayload) {
		super(fruit);
    
		this.sprite = new Sprite('../sprites/fruits.png');

		this.sprite.addAnimation('apple', [
			[0, 0, 50, 50],
		]);
	}

	public draw(context: CanvasRenderingContext2D) {
		this.sprite.draw('apple', context, this.x, this.y, this.width, this.height);
	}
}