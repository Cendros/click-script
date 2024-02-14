import {
  window,
  commands,
  ExtensionContext,
  EventEmitter,
  Event,
  ThemeIcon,
} from "vscode";
import { executeScript, getMakeScripts, getScripts } from "./utils";

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand(
    "click-script.executeScript",
    async () => {
      const scripts = getScripts();
      if (!scripts) {
        return window.showErrorMessage(
          "You don't have any scripts in your package.json file."
        );
      }
      const quickPick = window.createQuickPick();
      quickPick.items = Object.entries(scripts.scripts).map(
        ([label, command]) => ({ label: label, description: String(command) })
      );
      quickPick.title = "Choose a script to execute";

      quickPick.onDidAccept(() => {
        const { label } = quickPick.activeItems[0];
        executeScript("npm run", label);
        quickPick.hide();
      });

      quickPick.show();
    }
  );

  const disposableMake = commands.registerCommand(
    "click-script.executeMake",
    async () => {
      const scripts = getMakeScripts();
      
      if (!scripts) {
        return window.showErrorMessage(
          "You don't have any scripts in your Makefile file."
        );
      }
      const quickPick = window.createQuickPick();
      quickPick.items = Object.keys(scripts.scripts).map((label: string) => ({ label: label }));
      quickPick.title = "Choose a script to execute";

      quickPick.onDidAccept(() => {
        const { label } = quickPick.activeItems[0];
        executeScript("make", label);
        quickPick.hide();
      });

      quickPick.show();
    }
  );

  const _onDidChangeTreeData: EventEmitter<undefined> =
    new EventEmitter<undefined>();
  const onDidChangeTreeData: Event<undefined> = _onDidChangeTreeData.event;

  const packageTreeView = window.createTreeView("click-script-package", {
    treeDataProvider: {
      getChildren: () => {
        const scripts = getScripts();
        if (!scripts) {
          window.showErrorMessage(
            "You don't have any scripts in your package.json file."
          );
        }

        return scripts
          ? Object.keys(scripts.scripts).map((label) => ({
              label: label,
              iconPath: new ThemeIcon("play"),
            }))
          : [];
      },
      getTreeItem: (items) => {
        return items;
      },
      onDidChangeTreeData: onDidChangeTreeData,
    },
  });

  packageTreeView.onDidChangeSelection((item) => {
    executeScript("npm run", item.selection[0].label);
  });

  packageTreeView.onDidChangeVisibility(() => {
    _onDidChangeTreeData.fire(undefined);
  });

  const makeTreeView = window.createTreeView("click-script-make", {
    treeDataProvider: {
      getChildren: () => {
        const scripts = getMakeScripts();
        if (!scripts) {
          window.showErrorMessage(
            "You don't have any scripts in your Makefile."
          );
        }

        return scripts
          ? Object.keys(scripts.scripts).map((label) => ({
              label: label,
              iconPath: new ThemeIcon("play"),
            }))
          : [];
      },
      getTreeItem: (items) => {
        return items;
      },
      onDidChangeTreeData: onDidChangeTreeData,
    },
  });

  makeTreeView.onDidChangeSelection((item) => {
    executeScript("make", item.selection[0].label);
  });

  makeTreeView.onDidChangeVisibility(() => {
    _onDidChangeTreeData.fire(undefined);
  });

  context.subscriptions.push(disposable, disposableMake, packageTreeView, makeTreeView);
}

export function deactivate() {}
