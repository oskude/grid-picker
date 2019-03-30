export
class ResizeHandler
extends HTMLElement
{
	constructor ()
	{
		super();
		this.attachShadow({mode:"open"});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					position: absolute;
					/* TODO: let user set these */
					width: 10px;
					height: 100%;
					background: purple;
					opacity: 0.5;
					cursor: col-resize;
				}
			</style>
		`;
		this.size = 10;
		this.pos = 0;
		this.type = 0; // 0 == vertical, 1 == horizontal
		this.bindOnMouseUp = this.onMouseUp.bind(this);
		this.bindOnMouseMove = this.onMouseMove.bind(this);
		this.addEventListener("mousedown", this.onMouseDown.bind(this));
	}

	onMouseDown (event)
	{
		document.addEventListener("mouseup", this.bindOnMouseUp);
		document.addEventListener("mousemove", this.bindOnMouseMove);
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	onMouseUp (event)
	{
		document.removeEventListener("mouseup", this.bindOnMouseUp);
		document.removeEventListener("mousemove", this.bindOnMouseMove);
	}

	onMouseMove (event)
	{
		let newPos = event.clientX;
		if (this.type === 1) {
			let newPos = event.clientY;
		}

		if (this.pos != newPos) {
			this.pos = newPos;
			this.setPos(newPos);
			this.onMove(newPos);
		}
	}

	onMove (pos)
	{
		// to be used by consumer
	}

	setPos (pos)
	{
		if (this.type === 1) {
			this.style.top = (pos - this.size/2) + "px";
		} else {
			this.style.left = (pos - this.size/2) + "px";
		}
	}
}
customElements.define(
	"resize-handler",
	ResizeHandler
);
