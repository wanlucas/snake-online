import Entity from './Entity';

interface TilePayload {
  x: number;
  y: number;
  size: number;
}

export default class Tile extends Entity {
	constructor({
		x,
		y,
		size,
	}: TilePayload) {
		super(x, y, size, size);
	}
}