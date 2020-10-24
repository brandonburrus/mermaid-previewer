#! /usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const pkgJson = require('../package.json');
const { render, startServer } = require('./renderer');

const cmd = yargs(process.argv.slice(2))
  .scriptName('mermaid')
  .usage('$0 <diagram file> [args]')
  .options({
    'port': {
      alias: 'p',
      default: 9510,
      describe: 'The port number to run the static file serving from',
      type: 'number'
    }
  })
  .alias('v', 'version')
  .help()
  .version(`${chalk.cyan('Mermaid Previewer')} v${pkgJson.version}`)
  .argv;

const { _: [fileName], port } = cmd;

const usage = 'Usage: mermaid <diagram file> [args]';

// Require file name parameter to be passed.
if (!fileName) {
  console.log(chalk.red('File name is required.'));
  console.log(usage);
  process.exit(-1);
}

// Make sure file is a mmd file.
if (!fileName.endsWith('.mmd')) {
  console.log(chalk.red('File must be a .mmd file'));
  console.log(usage);
  process.exit(-1);
}

const absolutePath = path.resolve(process.cwd(), fileName);
const diagramFileName = path.basename(absolutePath);
const getDiagramFromFile = () => fs.readFileSync(absolutePath, { encoding: 'utf8' });

/**
 * Collect diagram options
 */
const getDiagramOptions = () => ({
  diagram: getDiagramFromFile(),
  diagramName: diagramFileName,
  exportPort: port,
  absolutePath
})

/**
 * Init live server
 */
startServer(getDiagramOptions());

/**
 * Init file watcher
 */
fs.watchFile(absolutePath, { interval: 500 }, () => {
  console.log(`Detected file change. ${chalk.green('Refreshing page')}...`);
  render(getDiagramOptions());
});
