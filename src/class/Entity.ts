export default class Entity {
	constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
	) {}

	public collidesWith(entity: Entity) {
		return (
			this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
		);
	}
}