# Contributing

## Code of Conduct

**IMPORTANT**: Before making any kind of contribution, please read the [Code of Conduct](./CODE_OF_CONDUCT.md)!

Violations of the Code of Conduct will result in the violating user account being blocked completely
from the repository, and all contributions to be rejected.

## Project Overview

Some background: This project was meant to just be a simple tool to make writing diagrams using the
lovely Mermaid.js syntax easier. It is meant as a command line alternative to the official [Mermaid
Live Editor](https://mermaid-js.github.io/mermaid-live-editor/), with the specific goal of allowing
users to use their preferred editor instead of a web editor.

That being said, features, bugfixes, and improvements are welcome! Generally it is recommended to
first open an [Issue on Github](https://github.com/BrandonBurrus/mermaid-previewer/issues) first,
however because this is a small project, directly opening a [Pull Request](https://github.com/BrandonBurrus/mermaid-previewer/pulls)
is totally ok!

Please remember that Mermaid does have an official [CLI tool](https://github.com/mermaid-js/mermaid-cli)
already. If you are considering adding a new feature, please be sure to check to see if this
existing tool would already meet your use-case.

## How it works

The first part is parsing the command line args like `port` and `help`. To handle this, the project
uses a [yargs](https://yargs.js.org/) configuration to handle configuration like this.

After parsing the command line args, theres a few basic checks to make sure that the given args are
valid.

Then the first command arg is parsed as the file path to the diagram file.

Once all of this initial setup is done, the live server starts, and then a file watching process
initializes.

The live server is a simple static file serving server that operates from a randomly generated temp
directory. It serves a since index.html file to the browser.

When the file watching process detects a change in the diagram file, it reads the diagram file which
is then sent to the live server process, which renders the diagram to html, and then writes it to
the index.html file.

For exporting, the html template includes a button that sends a POST request to a /export path
running on a local express server process running alongside the live server.

The live server runs on the port specified by the user, and the express server runs on the same port + 1
(so by default, live server is on 9510 and the express exporting server on 9511).

When the express server gets a POST to /export, it triggers the exporting process. All this process
does is render the diagram html template (without the export button) and then convert that html to a
JPEG file using a npm package.

## Getting Started

To get started, first clone the repo from github.

After you clone it, run `npm i` to install all of the package dependencies.

Now you can either run the command using `node src/index.js`, OR you can link the command to the bin
by running `npm link`, which will allow you to use the local version of the `mermaid` command.

NOTE: If you want to do the second one, make sure you first don't have the package installed globally
to avoid a command conflict.

And you're good to go! The `test-diagram.mmd` is a quick and easy way to test changes to the CLI
command.
