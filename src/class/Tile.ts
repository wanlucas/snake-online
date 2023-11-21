import Entity from './Entity';
import { Direction } from './Player';

interface TilePayload {
  x: number;
  y: number;
  size: number;
	direction: Direction;
}

export default class Tile extends Entity {
	public direction: Direction;

	constructor({
		x,
		y,
		size,
		direction,
	}: TilePayload) {
		super(x, y, size, size);

		this.direction = direction;
	}
}