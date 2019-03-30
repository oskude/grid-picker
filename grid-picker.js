import ResizeObserver from "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js";

export
class GridPicker
extends HTMLElement
{
	constructor ()
	{
		super();
		this.attachShadow({mode:"open"});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: grid;
				}
			</style>
			<slot></slot>
		`.replace(/>\s+</g, "><");
		let observer = new ResizeObserver(entries=>{
			this.onResize();
		});
		observer.observe(this);
	}

	onResize ()
	{
		let style = getComputedStyle(this);
		this.width = parseInt(style.width);
		console.log("WE_RESIZED", this.width);
	}
}
customElements.define(
	"grid-picker",
	GridPicker
);
