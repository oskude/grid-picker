export
class VerticalHandler
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
					background: white;
					opacity: 0.5;
					cursor: col-resize;
				}
			</style>
		`;
		this.size = 10;
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
		this.setPos(event.clientX);
		this.onMove(event.clientX);
	}

	onMove (pos)
	{
		// to be used by consumer
	}

	setPos (pos)
	{
		this.style.left = (pos - this.size/2) + "px";
	}
}
customElements.define(
	"vertical-handler",
	VerticalHandler
);
