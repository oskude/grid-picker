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
					background: purple;
					opacity: 0.5;
				}
			</style>
		`;
		this.size = 10;
		this.pos = 0;
		this._type = 0; // 0 == horizontal, 1 == vertical
		this.bindOnMouseUp = this.onMouseUp.bind(this);
		this.bindOnMouseMove = this.onMouseMove.bind(this);
		this.addEventListener("mousedown", this.onMouseDown.bind(this));
	}

	get type () {
		return this._type;
	}

	set type (t) {
		if (t === "vertical") {
			this._type = 1;
			this.style.width = "10px";
			this.style.height = "100%"
			this.style.cursor = "col-resize";
		} else {
			this._type = 0;
			this.style.width = "100%";
			this.style.height = "10px";
			this.style.cursor = "row-resize";
		}
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
		let newPos = event.clientY;
		if (this._type === 1) {
			newPos = event.clientX;
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
		if (this._type === 1) {
			this.style.left = (pos - this.size/2) + "px";
		} else {
			this.style.top = (pos - this.size/2) + "px";
		}
	}
}
customElements.define(
	"resize-handler",
	ResizeHandler
);
