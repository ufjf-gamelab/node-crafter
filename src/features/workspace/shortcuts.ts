export type KeyboardShortcutEvent = {
  ctrlKey: boolean;
  metaKey: boolean;
  key: string;
  shiftKey: boolean;
};

function hasCommandModifier(event: KeyboardShortcutEvent): boolean {
  return event.ctrlKey || event.metaKey;
}

export function isWorkspaceSaveShortcut(event: KeyboardShortcutEvent): boolean {
  return hasCommandModifier(event) && event.key.toLowerCase() === "s" && !event.shiftKey;
}

export function isDiagramExportShortcut(event: KeyboardShortcutEvent): boolean {
  return hasCommandModifier(event) && event.key.toLowerCase() === "s" && event.shiftKey;
}

export function isUndoShortcut(event: KeyboardShortcutEvent): boolean {
  return hasCommandModifier(event) && event.key.toLowerCase() === "z" && !event.shiftKey;
}

export function isRedoShortcut(event: KeyboardShortcutEvent): boolean {
  if (!hasCommandModifier(event)) return false;

  const key = event.key.toLowerCase();
  if (key === "z") return event.shiftKey;
  return key === "y" && !event.shiftKey;
}

export function isCopyShortcut(event: KeyboardShortcutEvent): boolean {
  return hasCommandModifier(event) && event.key.toLowerCase() === "c" && !event.shiftKey;
}

export function isPasteShortcut(event: KeyboardShortcutEvent): boolean {
  return hasCommandModifier(event) && event.key.toLowerCase() === "v" && !event.shiftKey;
}
