import Sprite from './Sprite';

interface FloorTile {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FloorConfig {
  width: number;
  height: number;
  horizontalTiles?: number;
  verticalTiles?: number;
}

export default class Floor {
	private tiles: FloorTile[][] = [];
	private sprite: Sprite;

	constructor(
		config: FloorConfig,
	) {
		this.sprite = new Sprite('../sprites/floor.jpg');

		this.sprite.addAnimation('grass', [
			[400, 400, 100, 100],
		]);

		const horizontalTiles = config.horizontalTiles || 15;
		const verticalTiles = config.verticalTiles || 10;
		const tileWidth = config.width / horizontalTiles;
		const tileHeight = config.height / verticalTiles;

		for (let i = 0; i < verticalTiles; i++) {
			this.tiles.push([]);

			for (let j = 0; j < horizontalTiles; j++) {
				this.tiles[i].push({
					x: j * tileWidth,
					y: i * tileHeight,
					width: tileWidth,
					height: tileHeight,
				});
			}
		}
	}

	public draw(context: CanvasRenderingContext2D) {
		this.tiles.forEach((row: FloorTile[]) => {
			row.forEach((tile: FloorTile) => {
				this.sprite.draw('grass', context, tile.x, tile.y, tile.width, tile.height);
			});
		});
	}
}