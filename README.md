# Mori-Extension-vscode README

- **Real-time Error Detection**: Instantly identifies syntax and logical errors in your code.
- **Autofix Suggestions**: Provides intelligent autofix recommendations using your custom AI model.
- **Customizable Rules**: Users can configure linting rules based on their preferences.
- **Seamless Integration**: Works within VS Code without disrupting the development workflow.


## Requirements
- **VS Code** (latest version recommended)
- **Flask** (for running the extension backend)
- **Python 3.8+** (if using AI model locally)
- **Your Custom AI Model** (deployed or running locally)

## Extension Settings
This extension contributes the following settings:

- `extension-vscode.enable`: Enable/disable the extension.
- `extension-vscode.autofix`: Enable/disable automatic fixing of detected errors.
- `extension-vscode.modelPath`: Path to the custom AI model for linting and auto fix.

## Known Issues
- Some autofix suggestions may not be accurate for complex logic errors.
- Performance may vary depending on the model size and computational power.


## Following Extension Guidelines
Ensure that you've read through the [extension guidelines](https://code.visualstudio.com/api/get-started/your-first-extension) and follow the best practices for creating your extension.

## Working with Markdown
You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- **Split the editor**: `Cmd+\` (macOS) or `Ctrl+\` (Windows/Linux).
- **Toggle preview**: `Shift+Cmd+V` (macOS) or `Shift+Ctrl+V` (Windows/Linux).
- **Markdown snippets**: Press `Ctrl+Space` to see a list of Markdown snippets.

For more information:
- [Visual Studio Code's Markdown Support](https://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://www.markdownguide.org/basic-syntax/)

Enjoy coding with **extension-vscode**! 🚀
