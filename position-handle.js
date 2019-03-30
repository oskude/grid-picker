export
class PositionHandle
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
					position: relative;
				}
				#startHandle,
				#endHandle {
					position: absolute;
					background: purple;
					opacity: 0.5;
					width: 20px;
					height: 20px;
				}
				#startHandle {
					top: 0;
					left: 0;
					cursor: nw-resize;
				}
				#endHandle {
					bottom: 0;
					right: 0;
					cursor: se-resize;
				}
			</style>
			<div id="startHandle"></div>
			<div id="endHandle"></div>
		`;
		this._boundOnMouseUp = this._onMouseUp.bind(this);
		this._boundOnMouseMove = this._onMouseMove.bind(this);
		this.addEventListener("mousedown", this._onMouseDown.bind(this));
	}

	set cell (c)
	{
		this._cell = c;
		let style = getComputedStyle(this._cell);
		this.style.gridColumn = style.gridColumn;
		this.style.gridRow = style.gridRow;
	}

	_onMouseDown (event)
	{
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
	}

	_onMouseMove (event)
	{
		console.log(event.clientX, event.clientY);
		// TODO: maybe use transform until user releases mouse?
		// TODO: DAMMIT!!!! if we are child of the cell, we cant move handle over other cells!!!!
		// TODO: so create a single handle element, that is size of cell? so its over all cells
		//       it has to be "connected" with the cell, so it gets resized when cell resizes (through row/col resize)
		//       WAIT! cant we attach the handle element to the grid too!?!? AWESOME?
		if (this._type == 0) {
			this.style.top = event.clientY + "px";
			this.style.left = event.clientX + "px";
		} else {

		}
	}
}

customElements.define(
	"position-handle",
	PositionHandle
);
