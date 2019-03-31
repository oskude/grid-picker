export
class CornerHandle
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
				}
			</style>
		`.trim().replace(/>\s+</g, "><");
		this._bbox = {};
		this._boundOnMouseUp = this._onMouseUp.bind(this);
		this._boundOnMouseMove = this._onMouseMove.bind(this);
		this.addEventListener("mousedown", this._onMouseDown.bind(this));
	}

	_onMouseDown (event)
	{
		this._bbox = this.getBoundingClientRect();
		document.addEventListener("mouseup", this._boundOnMouseUp);
		document.addEventListener("mousemove", this._boundOnMouseMove);
		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	_onMouseUp (event)
	{
		document.removeEventListener("mouseup", this._boundOnMouseUp);
		document.removeEventListener("mousemove", this._boundOnMouseMove);
		this.style.transform = "";
		this.onDone(event.clientX, event.clientY);
	}

	_onMouseMove (event)
	{
		let x = event.clientX - this._bbox.left - (this._bbox.width/2);
		let y = event.clientY - this._bbox.top - (this._bbox.height/2);
		this.style.transform = `translate(${x}px,${y}px)`;
		this.onMove(event.clientX, event.clientY);
	}

	onMove (x, y)
	{
		// consumer todo
	}

	onDone (x, y)
	{
		// consumer todo
	}
}

customElements.define(
	"corner-handle",
	CornerHandle
)
