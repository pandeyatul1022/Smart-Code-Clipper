# Smart Code Clipper

A small Chrome extension that removes leading line numbers from pasted code and
copies the cleaned result to the clipboard. The popup also supports light and
dark themes and remembers the selected theme. It shows a success or error
message when copying code to the clipboard.

Maintained by Atul Pandey.

Line numbers are removed when every non-empty line has a supported numbering
prefix (`1.`, `1:`, `1)`, `1 -`, `1 |`, or `[1]`) and at least two lines form
an ascending sequence that increases by one each line. Single-line cleaning
can be enabled with its checkbox; it is off by default to avoid changing
ambiguous code. Leading indentation and original line endings are preserved;
unnumbered or non-sequential code is left unchanged.

## Project structure

```text
Smart Code Clipper/
|-- assets/
|   |-- css/
|   |   `-- popup.css
|   |-- images/
|   |   `-- icon.png
|   `-- js/
|       `-- popup.js
|-- index.html
|-- manifest.json
|-- LICENSE
`-- README.md
```

The root `manifest.json` is kept at the extension root so Chrome can load the
project directly as an unpacked extension.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project folder (the folder containing `manifest.json`).

There is no build step. After changing files, reload the extension from
`chrome://extensions` to apply the changes.

## License

This project uses the proprietary terms in [LICENSE](./LICENSE). Use and
sharing of unmodified copies are allowed, including commercial use; modifying
or distributing modified versions is not permitted. Consider having a legal
professional review custom license terms before relying on them.
