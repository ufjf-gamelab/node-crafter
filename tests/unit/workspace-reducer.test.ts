import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createEmptyDiagram, createInitialWorkspace, getDiagramNames, workspaceReducer } from "../../src/features/workspace/workspace-reducer.ts";
import type { IDiagramContent, IWorkspace } from "../../src/features/workspace/types.ts";

const NOW = "2026-11-03T12:00:00.000Z";
const LATER = "2026-11-03T13:00:00.000Z";

const content: IDiagramContent = {
  nodes: [
    {
      id: "node-1",
      type: "diceGenerator",
      position: { x: 0, y: 0 },
      data: { name: "Dado", status: "IDLE", min: 1, max: 6 },
    },
  ],
  edges: [],
};

function createWorkspace(): IWorkspace {
  return createInitialWorkspace({ id: "diagram-1", name: "Diagrama 1", now: NOW });
}

describe("workspace reducer", () => {
  test("creates an initial workspace with one empty diagram", () => {
    const workspace = createWorkspace();

    assert.equal(workspace.activeDiagramId, "diagram-1");
    assert.equal(workspace.diagrams["diagram-1"].nodes.length, 0);
    assert.equal(workspace.diagrams["diagram-1"].revision, 0);
    assert.deepEqual(getDiagramNames(workspace), ["Diagrama 1"]);
  });

  test("creates a diagram and activates it", () => {
    const workspace = workspaceReducer(createWorkspace(), {
      type: "createDiagram",
      id: "diagram-2",
      name: "Diagrama 2",
      now: LATER,
    });

    assert.equal(workspace.activeDiagramId, "diagram-2");
    assert.deepEqual(getDiagramNames(workspace), ["Diagrama 1", "Diagrama 2"]);
  });

  test("duplicates a diagram without sharing node state", () => {
    const withContent = workspaceReducer(createWorkspace(), {
      type: "updateDiagram",
      id: "diagram-1",
      content,
      now: LATER,
    });

    const duplicated = workspaceReducer(withContent, {
      type: "duplicateDiagram",
      id: "diagram-2",
      sourceId: "diagram-1",
      name: "Cópia de Diagrama 1",
      now: LATER,
    });

    assert.equal(duplicated.activeDiagramId, "diagram-2");
    assert.equal(duplicated.diagrams["diagram-2"].nodes.length, 1);
    assert.equal(duplicated.diagrams["diagram-2"].revision, 0);
    assert.notEqual(duplicated.diagrams["diagram-1"].nodes, duplicated.diagrams["diagram-2"].nodes);

    duplicated.diagrams["diagram-2"].nodes[0].data.name = "Alterado";
    assert.equal(duplicated.diagrams["diagram-1"].nodes[0].data.name, "Dado");
  });

  test("renames a diagram and updates its metadata", () => {
    const renamed = workspaceReducer(createWorkspace(), {
      type: "renameDiagram",
      id: "diagram-1",
      name: "Novo nome",
      now: LATER,
    });

    assert.equal(renamed.diagrams["diagram-1"].name, "Novo nome");
    assert.equal(renamed.diagrams["diagram-1"].updatedAt, LATER);
    assert.equal(renamed.diagrams["diagram-1"].revision, 1);
  });

  test("updates content, viewport and revision", () => {
    const updated = workspaceReducer(createWorkspace(), {
      type: "updateDiagram",
      id: "diagram-1",
      content,
      viewport: { x: 10, y: 20, zoom: 1.5 },
      now: LATER,
    });

    assert.equal(updated.diagrams["diagram-1"].nodes.length, 1);
    assert.deepEqual(updated.diagrams["diagram-1"].viewport, { x: 10, y: 20, zoom: 1.5 });
    assert.equal(updated.diagrams["diagram-1"].revision, 1);
    assert.equal(updated.diagrams["diagram-1"].updatedAt, LATER);
  });

  test("closing the active diagram selects the next one", () => {
    let workspace = workspaceReducer(createWorkspace(), { type: "createDiagram", id: "diagram-2", name: "Diagrama 2", now: NOW });
    workspace = workspaceReducer(workspace, { type: "createDiagram", id: "diagram-3", name: "Diagrama 3", now: NOW });
    workspace = workspaceReducer(workspace, { type: "setActiveDiagram", id: "diagram-2" });

    const closed = workspaceReducer(workspace, {
      type: "closeDiagram",
      id: "diagram-2",
      replacementId: "replacement",
      replacementName: "Novo Diagrama",
      now: LATER,
    });

    assert.deepEqual(Object.keys(closed.diagrams), ["diagram-1", "diagram-3"]);
    assert.equal(closed.activeDiagramId, "diagram-3");
  });

  test("closing an inactive diagram keeps the active one", () => {
    const workspace = workspaceReducer(createWorkspace(), { type: "createDiagram", id: "diagram-2", name: "Diagrama 2", now: NOW });

    const closed = workspaceReducer(workspace, {
      type: "closeDiagram",
      id: "diagram-1",
      replacementId: "replacement",
      replacementName: "Novo Diagrama",
      now: LATER,
    });

    assert.equal(closed.activeDiagramId, "diagram-2");
    assert.deepEqual(Object.keys(closed.diagrams), ["diagram-2"]);
  });

  test("closing the last diagram creates an empty replacement", () => {
    const closed = workspaceReducer(createWorkspace(), {
      type: "closeDiagram",
      id: "diagram-1",
      replacementId: "diagram-new",
      replacementName: "Novo Diagrama",
      now: LATER,
    });

    assert.equal(closed.activeDiagramId, "diagram-new");
    assert.deepEqual(getDiagramNames(closed), ["Novo Diagrama"]);
    assert.equal(closed.diagrams["diagram-new"].nodes.length, 0);
  });

  test("adds an imported diagram and activates it", () => {
    const imported = createEmptyDiagram({ id: "imported", name: "Importado", now: NOW });

    const workspace = workspaceReducer(createWorkspace(), { type: "addDiagram", diagram: imported });

    assert.equal(workspace.activeDiagramId, "imported");
    assert.equal(workspace.diagrams["imported"].name, "Importado");
  });

  test("replaces the whole workspace", () => {
    const replacement = createInitialWorkspace({ id: "other", name: "Outro", now: NOW });
    const workspace = workspaceReducer(createWorkspace(), { type: "replaceWorkspace", workspace: replacement });

    assert.deepEqual(workspace, replacement);
  });
});
