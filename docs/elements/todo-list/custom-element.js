const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
	margin-bottom: 1rem;
}

[hidden]{
	display: none;
}

::slotted(*) {
	display: none;
}

:host([filter="active"]) ::slotted(todo-item:not([completed])),
:host([filter="completed"]) ::slotted(todo-item[completed]),
:host(:not([filter="active"], [filter="completed"])) ::slotted(todo-item) {
	display: block;
}

:focus {
	border: 1px solid var(--color-brand);
	outline: none;
}

[aria-selected="true"] {
	border: 1px solid var(--color-brand);
}

button {
	border: 1px solid transparent;
	background: none;
	padding: 4px 16px;
	border-radius: 2px;
	margin: 0 4px;
}

footer {
	position: relative;
	color: var(--color-foreground);
	padding: 10px 15px;
	height: 20px;
	text-align: center;
	border-top: 1px solid #e6e6e6;
}

footer:after {
	content: '';
    position: absolute;
    right: 0;
    bottom: 0px;
    left: 0;
    height: 20px;
    z-index: -1;
    box-shadow: 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

section {
	margin: 0;
	border: 1px solid #e6e6e6;
}
</style>

<section>
    <slot></slot>
    <footer>
	 	<span></span>
        <button data-filter="all" aria-selected="true">All</button>
        <button data-filter="active">Active</button>
        <button data-filter="completed">Completed</button>
    </footer>
</section>
`;

export class TodoListElement extends HTMLElement {
	constructor() {
		super().attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
	}

	static get observedAttributes() {
		return ["filter"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue != newValue) this[name] = newValue;
	}

	connectedCallback() {
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", this.onSlotChanged.bind(this));
		this.shadowRoot.addEventListener("toggle", this.onToggle.bind(this));
		Array.from(this.shadowRoot.querySelectorAll("[data-filter]")).forEach((filter) =>
			filter.addEventListener("click", this.onFilter.bind(this))
		);
		this.itemsLeft = this.uncompleted;
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector("slot").removeEventListener("slotchange", this.onSlotChanged.bind(this));
		this.shadowRoot.removeEventListener("toggle", this.onToggle.bind(this));
		Array.from(this.shadowRoot.querySelectorAll("[data-filter]")).forEach((filter) =>
			filter.removeEventListener("click", this.onFilter.bind(this))
		);
	}

	set filter(value) {
		if (value) {
			this.setAttribute("filter", value);
		} else {
			this.removeAttribute("filter");
		}
		Array.from(this.shadowRoot.querySelectorAll("[aria-selected]")).forEach((element) =>
			element.setAttribute("aria-selected", "false")
		);
		this.shadowRoot.querySelector(`[data-filter="${value}"]`).setAttribute("aria-selected", "true");
	}

	set itemsLeft(value) {
		this.shadowRoot.querySelector("footer span").textContent = `${value} ${value === 1 ? "todo" : "todos"} left`;
	}

	get items() {
		return Array.from(this.querySelectorAll("todo-item"));
	}

	get uncompleted() {
		return this.items.reduce((total, item) => total + (item.completed ? 0 : 1), 0);
	}

	onSlotChanged(event) {
		this.itemsLeft = this.uncompleted;
	}

	onToggle() {
		this.itemsLeft = this.uncompleted;
	}

	onFilter(event) {
		this.filter = event.target.dataset.filter;
	}
}
customElements.define("todo-list", TodoListElement);
