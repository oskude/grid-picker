import ResizeObserver from "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js";
import {ResizeHandle} from "./resize-handle.js";
import {PositionHandle} from "./position-handle.js";

// TODO: put in utils
Array.prototype.sumOf = function (from, to) {
	return this.slice(from, to+1).reduce((a, c)=>a+c);
}
Array.prototype.getFuzzyIndex = function (val) // TODO: rename
{
	for (let i = this.length-1; i >= 0; i--) {
		let w = this.sumOf(0, i);
		if (val > w) {
			return i + 1;
		}
	}
	return 0;
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
		`.trim().replace(/>\s+</g, "><");
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
			if (
				c.tagName === "RESIZE-HANDLE"
				|| c.tagName === "POSITION-HANDLE"
			) {
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

		// TODO: these are used elsewhere too
		// TODO: AHAA! these add "white borders" to right and bottom!!!
		//       i guess its cause we convert to % values and it doesnt roundup correctly?
		this.style.gridTemplateColumns = this.colSizes.reduce((a,c)=>{
			return a + (c / this.width) * 100 + "% ";
		}, "");
		this.style.gridTemplateRows = this.rowSizes.reduce((a,c)=>{
			return a + (c / this.height) * 100 + "% ";
		}, "");

		if (this.posHandles.length == 0) {
			for (let cell of this.cellPositions) {
				let posHandle = document.createElement("position-handle");
				posHandle.cell = cell.elem;
				posHandle.onStartHandleMove = (x, y) => {
					let colRow = this._getColRowOfPos(x, y);
					if (
						colRow[0] != cell.col.start
						|| colRow[1] != cell.row.start
					) {
						cell.col.start = colRow[0];
						cell.row.start = colRow[1];
						let col = [
							cell.col.start,
							cell.col.end
						].join(" / ");
						let row = [
							cell.row.start,
							cell.row.end
						].join(" / ");
						cell.elem.style.gridColumn = col;
						cell.elem.style.gridRow = row;
					}
				};
				// TODO: posHandle.onStartHandleMoveDone -> set posHandle.grid*

				this.posHandles.push(this.appendChild(posHandle));
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

	_getColRowOfPos (x, y)
	{
		return [
			this.colSizes.getFuzzyIndex(x) + 1,
			this.rowSizes.getFuzzyIndex(y) + 1
		];
	}
}
customElements.define(
	"grid-picker",
	GridPicker
);
