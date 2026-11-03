export type KeyboardShortcutEvent = {
  ctrlKey: boolean;
  metaKey: boolean;
  key: string;
  shiftKey: boolean;
};

export function isWorkspaceSaveShortcut(event: KeyboardShortcutEvent): boolean {
  return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s" && !event.shiftKey;
}

export function isDiagramExportShortcut(event: KeyboardShortcutEvent): boolean {
  return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s" && event.shiftKey;
}
