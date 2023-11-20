import Entity from './Entity';

export interface FruitPayload {
	id: number;
	x: number;
	y: number;
  width: number;
	height: number;
}

export default class Fruit extends Entity {
	public id: number;

	constructor({ id, x, y, width, height }: FruitPayload) {
		super(x, y, width, height);
		this.id = id;
	}
}