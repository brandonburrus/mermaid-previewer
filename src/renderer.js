const chalk = require('chalk');
const express = require('express');
const fs = require('fs');
const liveServer = require('live-server');
const nodeHtmlToImage = require('node-html-to-image');
const openExplorer = require('open-file-explorer');
const path = require('path');
const tmp = require('tmp');

/**
 * Create temp directory to statically serve files from
 */
const { name: tmpDir } = tmp.dirSync();

/**
 * Html diagram render template
 */
const template = ({ diagram, diagramName, exportPort, exportButtonHtml = '<button type="submit" id="export">Export</button>' }) => `
<!doctype html>
<html lang='en'>
  <head>
    <title>${diagramName}</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>">
  </head>
  <body>
    <div id="container">
      <div class="mermaid">
        ${diagram}
      </div>
    </div>
    ${exportButtonHtml}
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
      document.querySelector('#export').addEventListener('click', () => {
        fetch('http://localhost:${exportPort + 1}/export', {
          method: 'POST'
        });
      });
    </script>
    <style>
      #container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .mermaid {
        display: inline;
      }
      #export {
        position: fixed;
        background-color: #3498DB;
        color: white;
        padding: 8px 16px;
        left: 16px;
        bottom: 16px;
        border: 0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      }
    </style>
  </body>
</html>
`;

/**
 * Write diagram and diagramName to html file
 */
function render(templateParams) {
  fs.writeFileSync(
    path.join(tmpDir, 'index.html'),
    template(templateParams)
  );
}

/**
 * Export html diagram page to picture file
 */
function exportImg(templateOptions) {
  const { absolutePath } = templateOptions;
  const srcPath = path.dirname(absolutePath);
  const imageName = path.basename(absolutePath).replace(/\.mmd$/, '.jpeg');
  const imagePath = path.join(srcPath, imageName);

  nodeHtmlToImage({
    output: imagePath,
    html: template({
      ...templateOptions,
      exportButtonHtml: ''
    }),
  })

  openExplorer(imagePath);

  console.log(`Diagram was ${chalk.green('successfully')} exported`);
}

/**
 * Starts live server that auto-refreshes when a file changes
 */
function startServer(templateParams) {
  const app = express();
  const { exportPort } = templateParams;

  render(templateParams);
  liveServer.start({
    port: exportPort,
    root: tmpDir,
    open: true,
    logLevel: 0,
  });

  app.post('/export', () => exportImg(templateParams))

  app.listen(exportPort + 1, () => {
    console.log(`${chalk.cyan('Mermaid Diagram')} previewer is live at http://127.0.0.1:${exportPort}`);
  });
}

module.exports = {
  render,
  startServer,
};
