const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
	border-bottom: 1px solid #ededed;
	--todo-item-background-color: var(--color-light, #ffffff);
	--todo-item-active-color: var(--color-active, #5dc2af);
	--todo-item-remove-color: var(--color-remove, #bf4040);
	--todo-item-outline-color: var(--color-brand, #bf4040);
}
:focus + label, :active + label {
	outline: 2px solid var(--todo-item-outline-color);
	outline-offset: -1px;
}
[hidden] {
	display: none;
}
section:not([hidden]) {
	display: grid;
	grid-template-columns: 1fr auto;
	background-color: var(--todo-item-background-color);
	position: relative;
}

label {
	word-break: break-all;
	padding: 0.25rem 55px 0px 55px;
	position: relative;
	font-size: 1.5rem;
	min-height: 50px;
	line-height: 50px;
}
label svg {
	position: absolute;
	left: 0;
	top: 0;
}
label svg circle {
	stroke-width: 3;
}
label svg path {
	fill: var(--todo-item-active-color);
}
:checked + label {
	text-decoration: line-through;
}
:checked + label svg circle {
	stroke: var(--todo-item-active-color);
}
:checked + label svg path {
	fill: var(--todo-item-active-color);
	display: initial;
}
:not(:checked) + label svg path {
	fill: transparent;
}
button {
	appearance: none;
	width: 50px;
	border: none;
	margin: 0;
	padding: 0;
	background: none;
	position: absolute;
	right: 0;
}
button:focus {
	outline: 2px solid var(--todo-item-outline-color);
}
:host(:hover) button svg,
button:focus svg {
	stroke: var(--todo-item-remove-color);
}
button svg {
	stroke: transparent;
	stroke-width: 3;
}
.sr-only {
	position: absolute;
	left: -10000px;
	top: auto;
	width: 1px;
	height: 1px;
	overflow: hidden;
}
</style>
<section id="view">
	<input type="checkbox" id="status" class="sr-only" />
	<label for="status">
		<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
			<circle cx="50" cy="50" r="33" fill="transparent" stroke="currentColor" />
			<path d="M 62,38 L 65,40 47,65 37,56 39,53 47,60 Z" />
		</svg>
		<slot></slot>
	</label>
	<button name="remove" aria-label="Remove todo">
		<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" aria-hidden="true" focusable="false" stroke="currentColor">
			<line x1="40" y1="42" x2="61" y2="63" />
			<line x1="61" y1="42" x2="40" y2="63" />
		</svg>
	</button>
</section>
<section id="edit" hidden>
	<input type="text" />
</section>
`;

export class TodoItemElement extends HTMLElement {
	constructor() {
		super().attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
	}

	static get observedAttributes() {
		return ["completed"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue != newValue) this[name] = newValue === "";
	}

	connectedCallback() {
		this.shadowRoot.getElementById("status").addEventListener("change", this.onChange.bind(this));
	}

	disconnectedCallback() {
		this.shadowRoot.getElementById("status").removeEventListener("change", this.onChange.bind(this));
	}

	set completed(value) {
		this.shadowRoot.getElementById("status").checked = value;

		this.dispatchEvent(
			new CustomEvent("toggle", {
				detail: { completed: value },
				bubbles: true,
			})
		);

		if (value) {
			this.setAttribute("completed", "");
		} else {
			this.removeAttribute("completed");
		}
	}

	get completed() {
		return this.shadowRoot.getElementById("status").checked;
	}

	onChange(event) {
		this.completed = event.target.checked;
	}
}
customElements.define("todo-item", TodoItemElement);
