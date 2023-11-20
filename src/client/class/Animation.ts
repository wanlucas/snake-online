type SlicePayload = [number, number, number?, number?];

type Slice = [number, number, number, number];

interface SpriteConfig {
  baseWidth?: number;
  baseHeight?: number;
}

export default class Animation {
	public slices: Slice[];
	public frame: number;
	public image: HTMLImageElement;

	constructor(image: HTMLImageElement, slices: SlicePayload[], { baseWidth = 10, baseHeight = 10 }: SpriteConfig = {}) {
		this.frame = 0;
		this.image = image;

		this.slices = slices.map((
			[sx, sy, sw = baseWidth, sh = baseHeight]: SlicePayload
		) => [sx, sy, sw, sh]);
	}

	public draw(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, angle: number = 0) {
		const [sx, sy, sw, sh] = this.slices[this.frame];

		context.rotate(angle);

		context.drawImage(
			this.image,
			sx, sy,
			sw, sh,
			x, y,
			width, height,
		);

		context.rotate(-angle);

		this.frame = (this.frame + 1) % this.slices.length;
	}
}