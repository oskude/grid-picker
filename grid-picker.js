import ResizeObserver from "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js";
import {VerticalHandler} from "./vertical-handler.js";

// TODO: put in utils
Array.prototype.sumOf = function (from, to) {
	return this.slice(from, to+1).reduce((a, c)=>a+c);
}

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
		this.colHandlers = [];
	}

	onResize ()
	{
		let style = getComputedStyle(this);
		let colSizes = style.gridTemplateColumns.split(" ").map(e=>parseInt(e));
		let rowSizes = style.gridTemplateRows.split(" ").map(e=>parseInt(e));

		if (this.colHandlers.length == 0) {
			colSizes.some((colSize,i)=>{
				let handler = document.createElement("vertical-handler");
				this.colHandlers.push(this.appendChild(handler));
				return i == colSizes.length - 2; // exit after second last element
			});
		}

		this.colHandlers.forEach((handler,i)=>{
			handler.style.left = colSizes.sumOf(0,i) - 5 + "px";
		});
	}
}
customElements.define(
	"grid-picker",
	GridPicker
);
