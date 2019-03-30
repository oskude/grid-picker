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
					position: absolute;
					/* TODO: let user set these */
					background: purple;
					opacity: 0.5;
					width: 20px;
					height: 20px;
				}
			</style>
		`;
		this._type = 0;
	}

	get type () {
		return this._type;
	}

	set type (t) {
		if (t === "top-left") {
			this._type = 0;
			this.style.top = 0;
			this.style.left = 0;
			this.style.cursor = "nw-resize";
		} else {
			this._type = 1;
			this.style.bottom = 0;
			this.style.right = 0;
			this.style.cursor = "se-resize";
		}
	}
}

customElements.define(
	"position-handle",
	PositionHandle
);
