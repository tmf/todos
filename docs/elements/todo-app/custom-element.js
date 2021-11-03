const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
	box-shadow: 
		0 2px 4px 0 rgba(0, 0, 0, 0.2), 
		0 25px 50px 0 rgba(0, 0, 0, 0.1);
}
::slotted(*) {
	display: none;
}

::slotted(todo-list) {
	display: initial;
}

input {
	display: flex;
	width: 100%;

	padding: 16px 16px 16px 55px;
	margin: 0;
	border: none;
	box-sizing: border-box;
	box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
	
	font-size: 1.5em;
	line-height: 1.4em;
}
div {
	position: relative;
}
button {
	position: absolute;
	top: 0;
	width: 50px;
	bottom: 0;
	appearance: none;
	border: none;
	background: transparent;
}
svg {
	fill: #222;
}
:focus {
	outline: 2px solid var(--color-brand);
    outline-offset: -1px;
}
::placeholder {
	font-style: italic;
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

<div>
<form autocomplete="off">
    <label for="new" class="sr-only"></label>
    <input id="new" placeholder="What needs to be done?" autofocus />
</form>
<button name="toggle" aria-label="Toggle all todos">
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <path d="M 37,45 L 37,52 50,62 62,52 62,45 50,55 Z" />
    </svg>
</button>
</div>
<slot></slot>
`;

export class TodoAppElement extends HTMLElement {
	constructor() {
		super().attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.querySelector("form").addEventListener("submit", this.onSubmit.bind(this));
		this.shadowRoot.querySelector("button").addEventListener("click", this.onToggleAll.bind(this));
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector("form").removeEventListener("submit", this.onSubmit.bind(this));
		this.shadowRoot.querySelector("button").removeEventListener("click", this.onToggleAll.bind(this));
	}

	get todo() {
		return this.shadowRoot.querySelector("input").value;
	}

	set todo(value) {
		this.shadowRoot.querySelector("input").value = value;
	}

	onSubmit(event) {
		event.preventDefault();

		if (this.todo) {
			let item = document.createElement("todo-item");
			item.textContent = this.todo;

			if (!this.querySelector("todo-list")) {
				this.appendChild(document.createElement("todo-list"));
			}
			this.querySelector("todo-list").appendChild(item);

			this.todo = "";
		}
	}

	onToggleAll(event) {
		let items = Array.from(this.querySelectorAll("todo-item"));
		if (items.find((item) => !item.completed)) {
			items.forEach((todo) => (todo.completed = true));
		} else {
			items.forEach((todo) => (todo.completed = false));
		}
	}
}

customElements.define("todo-app", TodoAppElement);
