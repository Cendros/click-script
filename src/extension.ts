import { window, commands, ExtensionContext, EventEmitter, Event } from "vscode";
import { executeScript, getScripts } from "./utils";
import { Script } from "./types/script";

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

  let scripts: Script | undefined;

  const _onDidChangeTreeData: EventEmitter<undefined> = new EventEmitter<undefined>();
  const onDidChangeTreeData: Event<undefined> = _onDidChangeTreeData.event;

  const treeView = window.createTreeView("click-script-btns", {
    treeDataProvider: {
      getChildren: () => {
        const scripts = getScripts();
        if (!scripts)
          window.showErrorMessage(
            "You don't have any scripts in your package.json file."
        );

        return scripts ? Object.keys(scripts.scripts).map(label => ({
            label: label,
          })
        ) : []
      },
      getTreeItem: (items) => {
        return items;
      },
      onDidChangeTreeData: onDidChangeTreeData
    }
  });

  treeView.onDidChangeSelection((item) => {
    executeScript(item.selection[0].label, scripts?.scripts[item.selection[0].label] || '')
  })

  treeView.onDidChangeVisibility(() => {
    scripts = getScripts();
    _onDidChangeTreeData.fire(undefined);
  })

  context.subscriptions.push(treeView);
}

export function deactivate() {}
