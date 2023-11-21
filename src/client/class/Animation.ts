export type Slice = [number, number, number, number];

export default class Animation {
	public slices: Slice[];
	public frame: number;
	public image: HTMLImageElement;

	constructor(image: HTMLImageElement, slices: Slice[]) {
		this.frame = 0;
		this.image = image;
		this.slices = slices.map(([sx, sy, sw, sh]: Slice) => [sx, sy, sw, sh]);
	}

	public nextFrame() {
		this.frame = (this.frame + 1) % this.slices.length;
	}

	public draw(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, angle: number = 0) {
		const [sx, sy, sw, sh] = this.slices[this.frame];
		
		context.save();
		context.translate(x + width / 2, y + height / 2);
		context.rotate(angle * Math.PI / 180);

		context.drawImage(
			this.image,
			sx, sy,
			sw, sh,
			-width / 2, -height / 2,
			width, height,
		);

		context.restore();
		
		this.nextFrame();
	}
}