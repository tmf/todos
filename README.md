# todos

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tmf_todos&metric=alert_status&token=f75248b8a964fcccde991ddc628a90100f059766)](https://sonarcloud.io/dashboard?id=tmf_todos)

**_A dependency-free todo application built with the modern capabilities of the web platform_**

This [TodoMVC](tastejs/todomvc) inspired example application demonstrates a more sustainable way to create web applications: _without external code dependencies_.

## Features

- 📦 No external code dependencies
- ✅ Unit tests
- 🌈 Progressive web application
- 🤖 Automated workflows
- 🎇 Lighthouse score 100/100

## Demo

🚀 [tmf.github.io/todos](https://tmf.github.io/todos)

## Requirements

There are no external code dependencies, but there are 2 minimal requirements for running this application:

- HTTPS Web server: [Apache HTTP Server](https://httpd.apache.org), [nginx](https://nginx.org), [Github Pages](https://pages.github.com), [Cloudflare Pages](https://pages.cloudflare.com), ...
- Browser: [Firefox](https://mozilla.org/firefox/all#product-desktop-developer), [Chrome](https://google.com/chrome), [Safari](https://developer.apple.com/safari/download), [Edge](https://microsoft.com/edge), ...

See [Setup](SETUP.md) for instructions.

## Example
Here is a simple example HTML snippet to show a `<todo-list>` element:
```html
<todo-list>
	<todo-item completed>Write Readme</todo-item>
	<todo-item>Write HTML</todo-item>
	<todo-item>Write CSS</todo-item>
</todo-list>

```

## Documentation

- [Specification](spec/)
- [Setup](SETUP.md)
- [Web Application](docs/)
	- [HTML](docs/index.md)
	- [Service Worker](docs/serviceworker.md)
	- [Styles](docs/styles)
	- [Classes](docs/classes)
		- [`OfflineCache`](docs/classes/offline-cache.md)
- [Workflows](.github/workflows)
	- [Lighthouse](.github/workflows/lighthouse.md)
	- [SonarCloud](.github/workflows/sonarcloud.md)

## License

This project is licensed under the [MIT](LICENSE) license.
