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
				}
			</style>
		`;
	}
}
customElements.define(
	"vertical-handler",
	VerticalHandler
);
