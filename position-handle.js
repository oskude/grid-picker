import {CornerHandle} from "./corner-handle.js";

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
			<corner-handle id="startHandle"></corner-handle>
			<corner-handle id="endHandle"></corner-handle>
		`.trim().replace(/>\s+</g, "><");
		this._startHandle = this.shadowRoot.querySelector("#startHandle");
		this._endHandle = this.shadowRoot.querySelector("#endHandle");
	}

	set cell (c)
	{
		this._cell = c;
		let style = getComputedStyle(this._cell);
		this.style.gridColumn = style.gridColumn;
		this.style.gridRow = style.gridRow;
	}

	connectedCallback ()
	{
		this._startHandle.onMove = this.onStartHandleMove;
		this._startHandle.onDone = this.onStartHandleMoveDone;
		this._endHandle.onMove = this.onEndHandleMove;
		this._endHandle.onDone = this.onEndHandleMoveDone;
	}

	onStartHandleMove (x,y)
	{
		// consumer todo
	}

	onStartHandleMoveDone (x,y)
	{
		// consumer todo
	}

	onEndHandleMove (x,y)
	{
		// consumer todo
	}

	onEndHandleMoveDone (x,y)
	{
		// consumer todo
	}
}

customElements.define(
	"position-handle",
	PositionHandle
);
