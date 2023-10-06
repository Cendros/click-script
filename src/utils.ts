import * as vscode from 'vscode';
import * as fs from 'fs';

export const getScript = () => {
    if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage('Unable to locate files.');
			return;
    }
    const f = vscode.workspace.workspaceFolders[0].uri.fsPath;

    let file;
    try {
        file = fs.readFileSync(`${f}/package.json`, { encoding: 'utf8' });
    } catch (err) {
        vscode.window.showErrorMessage('Unable to package.json.');
        return;
    }
    const {scripts} = JSON.parse(file.toString());
    
    return { scripts: scripts };
}