import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isDiagramExportShortcut, isWorkspaceSaveShortcut } from "../../src/features/workspace/shortcuts.ts";

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
});
