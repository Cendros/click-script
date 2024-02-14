import * as vscode from "vscode";
import * as fs from "fs";

export const getScripts = () => {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage("Unable to locate files.");
    return;
  }
  const f = vscode.workspace.workspaceFolders[0].uri.fsPath;

  let file;
  try {
    file = fs.readFileSync(`${f}/package.json`, { encoding: "utf8" });
  } catch (err) {
    vscode.window.showErrorMessage("Unable to find package.json.");
    return;
  }
  const { scripts } = JSON.parse(file.toString());

  return { scripts };
};

export const getMakeScripts = () => {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage("Unable to locate files.");
    return;
  }

  const f = vscode.workspace.workspaceFolders[0].uri.fsPath;

  let file;
  try {
    file = fs.readFileSync(`${f}/Makefile`, { encoding: "utf8" });
  } catch (err) {
    vscode.window.showErrorMessage("Unable to find Makefile.");
    return;
  }
  const content = file.toString();
  let scripts = content.match(/^.*:$/gm)?.map((res) => res.slice(0, -1)) ?? [] as any[];

    scripts = scripts.reduce((acc, cur) => {
        acc[cur] = cur;
        return acc;
    }, {} as any);

  return { scripts };
};

export const executeScript = (executer: string, name: string) => {
  const terminal = vscode.window.createTerminal(name);
  terminal.show();
  terminal.sendText(`${executer} ${name}`);
};
