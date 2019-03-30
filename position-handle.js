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
					left: 0;
					top: 0;
					/* TODO: let user set these */
					background: purple;
					opacity: 0.5;
					width: 20px;
					height: 20px;
				}
			</style>
		`;
	}
}

customElements.define(
	"position-handle",
	PositionHandle
);
