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
		let observer = new IntersectionObserver((entries, observer)=>{
			console.log(entries);
		});
		observer.observe(this);
		/* no event for resizing :(
		let observer = new MutationObserver(mutations=>{
			mutations.forEach(mutation=>{
				console.log(mutation);
			});
		});
		observer.observe(this, {
			attributes: true, childList: true, subtree: true 
		});
		*/
	}
}
customElements.define(
	"grid-picker",
	GridPicker
);
