import Fruit from '../../class/Fruit';

export default class ClientFruit extends Fruit {
	constructor(fruit: Fruit) {
		super(
			fruit.id,
			fruit.position, 
			{ size: fruit.size }
		);
	}

	public draw(context: CanvasRenderingContext2D) {
		context.fillStyle = 'green';

		context.fillRect(
			this.position.x,
			this.position.y,
			this.size,
			this.size,
		);
	}
}