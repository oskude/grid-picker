import ResizeObserver from "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js";
import {ResizeHandle} from "./resize-handle.js";
import {PositionHandle} from "./position-handle.js";

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
		this.colHandles = [];
		this.rowHandles = [];
		this.posHandles = [];
	}

	onResize ()
	{
		let style = getComputedStyle(this);
		this.width = parseInt(style.width);
		this.height = parseInt(style.height);
		this.colSizes = style.gridTemplateColumns.split(" ").map(e=>parseInt(e));
		this.rowSizes = style.gridTemplateRows.split(" ").map(e=>parseInt(e));
		this.cellPositions = [...this.children].reduce((a,c)=>{
			if (c.tagName === "RESIZE-HANDLE") {
				return a;
			}
			let style = getComputedStyle(c);
			// TODO: style.grid* is not set in firefox!!! (works in chromium)
			let col = style.gridColumn.split(" / ");
			let row = style.gridRow.split(" / ");
			a.push({
				elem: c,
				col: {
					start: parseInt(col[0]),
					end: parseInt(col[1])
				},
				row: {
					start: parseInt(row[0]),
					end: parseInt(row[1])
				}
			});
			return a;
		}, []);

		if (this.posHandles.length == 0) {
			for (let cell of this.cellPositions) {
				let startHandle = document.createElement("position-handle");
				let endHandle = document.createElement("position-handle");
				startHandle.type = "top-left";
				endHandle.type = "bottom-right";
				this.posHandles.push(cell.elem.appendChild(startHandle));
				this.posHandles.push(cell.elem.appendChild(endHandle));
			}
		}

		if (this.colHandles.length == 0) {
			this.colSizes.some((colSize,i)=>{
				let handle = document.createElement("resize-handle");
				handle.type = "vertical";
				handle.onMove = (pos) => this.setColumnPos(i, pos);
				this.colHandles.push(this.appendChild(handle));
				return i == this.colSizes.length - 2; // exit after second last element
			});
		}

		if (this.rowHandles.length == 0) {
			this.rowSizes.some((rowSize,i)=>{
				let handle = document.createElement("resize-handle");
				handle.type = "horizontal";
				handle.onMove = (pos) => this.setRowPos(i, pos);
				this.rowHandles.push(this.appendChild(handle));
				return i == this.rowSizes.length - 2; // exit after second last element
			});
		}

		this.colHandles.forEach((handle,i)=>{
			handle.setPos(this.colSizes.sumOf(0,i));
		});

		this.rowHandles.forEach((handle,i)=>{
			handle.setPos(this.rowSizes.sumOf(0,i));
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

	setRowPos (i, pos)
	{
		let offset = this.rowSizes.sumOf(0, i);
		let sizeChange = pos - offset;

		this.rowSizes[i] += sizeChange;
		if (this.rowSizes[i+1] >= 1) {
			this.rowSizes[i+1] -= sizeChange;
		}

		this.style.gridTemplateRows = this.rowSizes.reduce((a,c)=>{
			return a + (c / this.height) * 100 + "% ";
		}, "");
	}
}
customElements.define(
	"grid-picker",
	GridPicker
);
