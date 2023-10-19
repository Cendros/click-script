import { window, commands, ExtensionContext } from "vscode";
import { executeScript, getScripts } from "./utils";

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    "click-script.executeScript",
    async () => {
      const scripts = getScripts();
      if (!scripts)
        return window.showErrorMessage(
          "You don't have any scripts in your package.json file."
        );

      const quickPick = window.createQuickPick();
      quickPick.items = Object.entries(scripts.scripts).map(
        ([label, command]) => ({ label: label, description: String(command) })
      );
      quickPick.title = "Choose a script to execute";

      quickPick.onDidAccept(() => {
        const { label } = quickPick.activeItems[0];
        executeScript(label, scripts.scripts[label]);
        quickPick.hide();
      });

      quickPick.show();
    }
  );

  context.subscriptions.push(disposable);

  // create a new tree view and display a button which show hello world
  const treeView = vscode.window.createTreeView("click-script-btns", {
    treeDataProvider: {
      getChildren: () => {
        return [
          {
            label: "Hello World",
            command: {
              command: "click-script.helloWorld",
              title: "Hello World",
            },
          },
          {
            label: "Hello World 2",
            command: {
              command: "click-script.helloWorld2",
              title: "Hello World 2",
            },
          },
          {
            label: "Hello World 3",
            command: {
              command: "click-script.helloWorld3",
              title: "Hello World 3",
            },
          },
        ];
      },
      getTreeItem: (items) => {
        return items;
      },
    },
  });
  context.subscriptions.push(treeView);
}

export function deactivate() {}
