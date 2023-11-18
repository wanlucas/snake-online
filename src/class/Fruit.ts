import { Position } from '../interface/entity';

export interface FruitOptions {
  size?: number;
}

export default class Fruit {
	public size: number;

	constructor(
    public position: Position,
    options: FruitOptions = {},
	) {
		this.size = options.size || 15;
	}
}