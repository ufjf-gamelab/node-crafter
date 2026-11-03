import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { CORRUPT_WORKSPACE_STORAGE_KEY_PREFIX, WORKSPACE_STORAGE_KEY, loadWorkspace, saveWorkspace, type StorageLike } from "../../src/features/workspace/storage.ts";
import { createInitialWorkspace, workspaceReducer } from "../../src/features/workspace/workspace-reducer.ts";

const NOW = "2026-11-03T12:00:00.000Z";

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function createWorkspace() {
  return createInitialWorkspace({ id: "diagram-1", name: "Diagrama 1", now: NOW });
}

describe("workspace storage", () => {
  test("creates an initial workspace when storage is empty", () => {
    const result = loadWorkspace(new MemoryStorage(), { initialName: "Exemplo", createId: () => "diagram-new", now: () => NOW });

    assert.equal(result.loaded, false);
    assert.equal(result.error, undefined);
    assert.equal(result.workspace.activeDiagramId, "diagram-new");
    assert.equal(result.workspace.diagrams["diagram-new"].name, "Exemplo");
  });

  test("saves and loads a workspace", () => {
    const storage = new MemoryStorage();
    const workspace = workspaceReducer(createWorkspace(), { type: "createDiagram", id: "diagram-2", name: "Diagrama 2", now: NOW });

    saveWorkspace(storage, workspace);
    const result = loadWorkspace(storage, { initialName: "Exemplo", createId: () => "x", now: () => NOW });

    assert.equal(result.loaded, true);
    assert.equal(result.workspace.activeDiagramId, "diagram-2");
    assert.deepEqual(Object.keys(result.workspace.diagrams), ["diagram-1", "diagram-2"]);
  });

  test("backs up and replaces a corrupt workspace", () => {
    const storage = new MemoryStorage();
    storage.setItem(WORKSPACE_STORAGE_KEY, "{invalid json");

    const result = loadWorkspace(storage, { initialName: "Exemplo", createId: () => "new", now: () => NOW });
    const backupKeys = Array.from(storage.values.keys()).filter((key) => key.startsWith(CORRUPT_WORKSPACE_STORAGE_KEY_PREFIX));

    assert.equal(result.loaded, false);
    assert.match(result.error ?? "", /JSON/);
    assert.equal(backupKeys.length, 1);
    assert.equal(storage.getItem(backupKeys[0]), "{invalid json");
  });

  test("propagates quota errors when saving", () => {
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };

    assert.throws(() => saveWorkspace(storage, createWorkspace()), /QuotaExceededError/);
  });
});
