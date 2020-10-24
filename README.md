# mermaid-previewer

![version](https://img.shields.io/npm/v/mermaid-previewer?style=for-the-badge) ![license](https://img.shields.io/npm/l/mermaid-previewer?style=for-the-badge)

Basic CLI tool for previewing live edits to [Mermaid.js](https://mermaid-js.github.io/) Diagrams

![Mermaid preview cli tool screen recording](./resources/preview.gif)

## Installation

To install the CLI tool using NPM:

```bash
npm install -g mermaid-previewer
```

## Usage

```bash
mermaid <diagram file>
```

The `<diagram file>` is a required option which should simply be the name of the `.mmd` Mermaid.js
Diagram file.

The `.mmd` file extension is *required*.

Running the CLI tool will open a local preview server, displaying the diagram preview in the
browser. Any changes to the target diagram file will automatically refresh the preview.

The preview also includes an 'Export' button. Clicking this will export the diagram to the same
location as the original target diagram file as a JPEG.

## CLI Options

`--port`: Sets the preview server port (default: 9510).
`--help`: Displays the help output
`--version`: Displays the current version

## Contributing
Pull Requests are welcome! Check out the [CONTRIBUTING.md](./CONTRIBUTING.md) file for project
details.

## License
[MIT](./LICENSE)
