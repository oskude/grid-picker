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
		this.colSizes = style.gridTemplateColumns.split(" ").map(e=>parseInt(e));
		this.rowSizes = style.gridTemplateRows.split(" ").map(e=>parseInt(e));
		this.width = parseInt(style.width);

		if (this.colHandlers.length == 0) {
			this.colSizes.some((colSize,i)=>{
				let handler = document.createElement("vertical-handler");
				handler.onMove = (pos) => this.setColumnPos(i, pos);
				this.colHandlers.push(this.appendChild(handler));
				return i == this.colSizes.length - 2; // exit after second last element
			});
		}

		this.colHandlers.forEach((handler,i)=>{
			handler.setPos(this.colSizes.sumOf(0,i));
		});
	}

	setColumnPos (i, pos)
	{
		let offset = this.colSizes.sumOf(0, i);
		let sizeChange = pos - offset;

		this.colSizes[i] += sizeChange;
		if (this.colSizes[i+1] >= 1) {
			this.colSizes[i+1] -= sizeChange;
		}

		this.style.gridTemplateColumns = this.colSizes.reduce((a,c)=>{
			return a + (c / this.width) * 100 + "% ";
		}, "");
	}
}
customElements.define(
	"grid-picker",
	GridPicker
);
