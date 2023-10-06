// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "click-script" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('click-script.listScripts', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		
		if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage('Unable to locate files.');
			return;
		}
		const f = vscode.workspace.workspaceFolders[0].uri.fsPath;

		let file;
		try {
        file = fs.readFileSync(`${f}/package.json`, { encoding: 'utf8' });
		} catch (err) {
			vscode.window.showErrorMessage('Unable to find package.json.');
			return;
		}
		
		const {scripts} = JSON.parse(file.toString());

		console.log(scripts);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
