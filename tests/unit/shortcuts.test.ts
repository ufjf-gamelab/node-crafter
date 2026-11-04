import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  isCopyShortcut,
  isDiagramExportShortcut,
  isPasteShortcut,
  isRedoShortcut,
  isUndoShortcut,
  isWorkspaceSaveShortcut,
} from "../../src/features/workspace/shortcuts.ts";

describe("workspace shortcuts", () => {
  test("recognizes Ctrl+S and Cmd+S as workspace save", () => {
    assert.equal(isWorkspaceSaveShortcut({ ctrlKey: true, metaKey: false, key: "s", shiftKey: false }), true);
    assert.equal(isWorkspaceSaveShortcut({ ctrlKey: false, metaKey: true, key: "S", shiftKey: false }), true);
  });

  test("recognizes Ctrl+Shift+S and Cmd+Shift+S as diagram export", () => {
    assert.equal(isDiagramExportShortcut({ ctrlKey: true, metaKey: false, key: "s", shiftKey: true }), true);
  });

  test("does not confuse the two shortcuts", () => {
    assert.equal(isWorkspaceSaveShortcut({ ctrlKey: true, metaKey: false, key: "s", shiftKey: true }), false);
    assert.equal(isDiagramExportShortcut({ ctrlKey: true, metaKey: false, key: "s", shiftKey: false }), false);
  });

  test("recognizes undo and redo", () => {
    assert.equal(isUndoShortcut({ ctrlKey: true, metaKey: false, key: "z", shiftKey: false }), true);
    assert.equal(isUndoShortcut({ ctrlKey: false, metaKey: true, key: "Z", shiftKey: false }), true);
    assert.equal(isUndoShortcut({ ctrlKey: true, metaKey: false, key: "z", shiftKey: true }), false);

    assert.equal(isRedoShortcut({ ctrlKey: true, metaKey: false, key: "z", shiftKey: true }), true);
    assert.equal(isRedoShortcut({ ctrlKey: false, metaKey: true, key: "Z", shiftKey: true }), true);
    assert.equal(isRedoShortcut({ ctrlKey: true, metaKey: false, key: "y", shiftKey: false }), true);
    assert.equal(isRedoShortcut({ ctrlKey: true, metaKey: false, key: "z", shiftKey: false }), false);
  });

  test("recognizes copy and paste", () => {
    assert.equal(isCopyShortcut({ ctrlKey: true, metaKey: false, key: "c", shiftKey: false }), true);
    assert.equal(isCopyShortcut({ ctrlKey: false, metaKey: true, key: "C", shiftKey: false }), true);
    assert.equal(isCopyShortcut({ ctrlKey: true, metaKey: false, key: "c", shiftKey: true }), false);

    assert.equal(isPasteShortcut({ ctrlKey: true, metaKey: false, key: "v", shiftKey: false }), true);
    assert.equal(isPasteShortcut({ ctrlKey: false, metaKey: true, key: "V", shiftKey: false }), true);
    assert.equal(isPasteShortcut({ ctrlKey: true, metaKey: false, key: "v", shiftKey: true }), false);
  });
});
