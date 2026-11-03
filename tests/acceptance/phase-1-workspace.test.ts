import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { createEmptyDiagram, createInitialWorkspace, getDiagramNames, workspaceReducer } from "../../src/features/workspace/workspace-reducer.ts";
import { deserializeDiagram, deserializeWorkspace, serializeDiagram, serializeWorkspace } from "../../src/features/workspace/serialization.ts";
import { loadWorkspace, saveWorkspace } from "../../src/features/workspace/storage.ts";
import { makeUniqueDiagramName } from "../../src/features/workspace/naming.ts";

const NOW = "2026-11-03T12:00:00.000Z";
const VALID_TYPES = new Set(["diceGenerator", "diceMath", "integerValue", "histogram"]);

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("phase 1 workspace acceptance", () => {
  test("an empty browser starts with one example diagram", () => {
    const storage = new MemoryStorage();
    const result = loadWorkspace(storage, { initialName: "Exemplo", createId: () => "example", now: () => NOW });

    assert.equal(result.loaded, false);
    assert.equal(result.workspace.activeDiagramId, "example");
    assert.deepEqual(getDiagramNames(result.workspace), ["Exemplo"]);
  });

  test("create, duplicate, rename and close keep independent diagrams", () => {
    let workspace = createInitialWorkspace({ id: "a", name: "A", now: NOW });

    workspace = workspaceReducer(workspace, { type: "createDiagram", id: "b", name: "B", now: NOW });
    workspace = workspaceReducer(workspace, { type: "duplicateDiagram", id: "c", sourceId: "b", name: "B copy", now: NOW });
    workspace = workspaceReducer(workspace, { type: "renameDiagram", id: "c", name: "Renamed", now: NOW });
    workspace = workspaceReducer(workspace, { type: "closeDiagram", id: "b", replacementId: "x", replacementName: "Novo", now: NOW });

    assert.deepEqual(Object.keys(workspace.diagrams), ["a", "c"]);
    assert.equal(workspace.diagrams["c"].name, "Renamed");
    assert.equal(workspace.activeDiagramId, "c");
  });

  test("closing the last diagram never leaves an empty workspace", () => {
    const workspace = workspaceReducer(createInitialWorkspace({ id: "a", name: "A", now: NOW }), {
      type: "closeDiagram",
      id: "a",
      replacementId: "replacement",
      replacementName: "Novo Diagrama",
      now: NOW,
    });

    assert.equal(Object.keys(workspace.diagrams).length, 1);
    assert.equal(workspace.activeDiagramId, "replacement");
  });

  test("diagram export and import preserve graph data", () => {
    const raw = JSON.parse(readFileSync(new URL("../fixtures/legacy-board.json", import.meta.url), "utf8"));
    const diagram = deserializeDiagram(raw, { id: "imported", fallbackName: "Importado", now: NOW, validNodeTypes: VALID_TYPES });
    const file = serializeDiagram(diagram);
    const restored = deserializeDiagram(file, { id: "restored", fallbackName: "Restaurado", now: NOW });

    assert.equal(restored.nodes.length, diagram.nodes.length);
    assert.equal(restored.name, "Importado");
  });

  test("workspace export and import restore tabs and the active diagram", () => {
    const storage = new MemoryStorage();
    const diagram = createEmptyDiagram({ id: "a", name: "A", now: NOW });
    const workspace = { schemaVersion: 1 as const, activeDiagramId: "a", diagrams: { a: diagram } };
    saveWorkspace(storage, workspace);

    const loaded = loadWorkspace(storage, { initialName: "Exemplo", createId: () => "x", now: () => NOW }).workspace;
    const file = serializeWorkspace(loaded);
    const restored = deserializeWorkspace(file, { now: NOW });

    assert.equal(restored.activeDiagramId, "a");
    assert.deepEqual(Object.keys(restored.diagrams), ["a"]);
  });

  test("legacy TXT/JSON boards can still be imported", () => {
    const raw = JSON.parse(readFileSync(new URL("../fixtures/legacy-board.json", import.meta.url), "utf8"));
    const diagram = deserializeDiagram(raw, { id: "legacy", fallbackName: "legacy", now: NOW, validNodeTypes: VALID_TYPES });

    assert.equal(diagram.nodes.length, 4);
    assert.equal(diagram.edges.length, 3);
  });

  test("duplicate names receive an automatic suffix", () => {
    assert.equal(makeUniqueDiagramName("Diagrama", ["Diagrama"]), "Diagrama 2");
    assert.equal(makeUniqueDiagramName("Diagrama", ["Diagrama", "Diagrama 2"]), "Diagrama 3");
  });
});
