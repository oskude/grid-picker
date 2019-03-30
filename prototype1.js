import {GridPicker} from "./grid-picker.js";

/*
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
					contain: content;
					position: absolute;
				}
				div {
					position: absolute;
				}
			</style>
			<div>X</div>
		`;
	}
}
window.customElements.define("vertical-handler", VerticalHandler);

function addGridPicker (gridElement)
{
	let style = getComputedStyle(gridElement);
	let colSizes = style.gridTemplateColumns.split(" ").map(e=>parseInt(e));
	let rowSizes = style.gridTemplateRows.split(" ").map(e=>parseInt(e));

	colSizes.some((colSize,i)=>{
		console.log(colSize);
		let handlerElem = document.createElement("vertical-handler");
		gridElement.appendChild(handlerElem);
		return i == colSizes.length - 2; // exit after second last element
	});
}
*/
