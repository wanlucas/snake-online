import Entity from './Entity';
import { Direction } from './Player';

interface TilePayload {
  x: number;
  y: number;
  size: number;
	direction: Direction;
	newTile?: boolean;
}

export default class Tile extends Entity {
	public direction: Direction;
	public newTile: boolean;

	constructor({
		x,
		y,
		size,
		direction,
		newTile = false,
	}: TilePayload) {
		super(x, y, size, size);

		this.direction = direction;
		this.newTile = newTile;
	}
}