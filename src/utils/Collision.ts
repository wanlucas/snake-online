interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default class Collision {
	public static rectToRect(a: Rect, b: Rect) {
		return (
			a.x + a.w >= b.x
      && a.x <= b.x + b.w
      && a.y + a.h >= b.y
      && a.y <= b.y + b.h
		);
	}
}