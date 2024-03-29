# todos

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tmf_todos&metric=alert_status&token=f75248b8a964fcccde991ddc628a90100f059766)](https://sonarcloud.io/dashboard?id=tmf_todos)

**_A dependency-free todo application built with the modern capabilities of the web platform_**

This [TodoMVC](https://github.com/tastejs/todomvc) inspired example application demonstrates a more sustainable way to create web applications: _without external code dependencies_.

## Features

- 📦 No external code dependencies
- ✅ Unit tests
- 🌈 Progressive web application
- 🤖 Automated workflows
- 🎇 Lighthouse score 100/100
- 🧩 Custom elements

## Demo

🚀 [tmf.github.io/todos](https://tmf.github.io/todos)

## Requirements

There are no external code dependencies, the only requirements for running this application are:

- a HTTPS web server: [Apache HTTP Server](https://httpd.apache.org), [nginx](https://nginx.org), [Github Pages](https://pages.github.com), [Cloudflare Pages](https://pages.cloudflare.com), ...
- a browser: [Firefox](https://mozilla.org/firefox/all#product-desktop-developer), [Chrome](https://google.com/chrome), [Safari](https://developer.apple.com/safari/download), [Edge](https://microsoft.com/edge), ...

See [Get started locally](SETUP.md#get-started-locally) for instructions.

## Example
Here is a simple example HTML snippet to show a `<todo-list>` element:
```html
<todo-list>
	<todo-item completed>Write Readme</todo-item>
	<todo-item>Write HTML</todo-item>
	<todo-item>Write CSS</todo-item>
</todo-list>

<script type="module" src="https://tmf.github.io/todos/elements/todo-list/custom-element.js"></script>
<script type="module" src="https://tmf.github.io/todos/elements/todo-item/custom-element.js"></script>
```

## Documentation

- [Setup](SETUP.md)
- [Web Application](docs/)
	- [HTML](docs/index.md)
	- [Service Worker](docs/serviceworker.md)
	- [Styles](docs/styles)
	- [Classes](docs/classes)
		- [`OfflineCache`](docs/classes/offline-cache.md)
	- [Custom Elements](docs/elements)
		- [`<todos-list>`](docs/elements/todos-list)
		- [`<todos-item>`](docs/elements/todos-item)
- [Workflows](.github/workflows)
	- [Lighthouse](.github/workflows/lighthouse.md)
	- [SonarCloud](.github/workflows/sonarcloud.md)

## License

This project is licensed under the [MIT](LICENSE) license.
