import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { detectFileKind, deserializeDiagram, deserializeWorkspace, serializeDiagram, serializeWorkspace } from "../../src/features/workspace/serialization.ts";
import type { IDiagram, IWorkspace } from "../../src/features/workspace/types.ts";

const NOW = "2026-11-03T12:00:00.000Z";
const VALID_TYPES = new Set(["diceGenerator", "diceMath", "integerValue", "histogram"]);

function readFixture(name: string): unknown {
  return JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));
}

function createDiagram(raw: unknown, validNodeTypes = VALID_TYPES): IDiagram {
  return deserializeDiagram(raw, { id: "diagram-1", fallbackName: "Importado", now: NOW, validNodeTypes });
}

describe("diagram serialization", () => {
  test("imports the legacy JSON board format", () => {
    const diagram = createDiagram(readFixture("legacy-board.json"));

    assert.equal(diagram.name, "Importado");
    assert.equal(diagram.nodes.length, 4);
    assert.equal(diagram.edges.length, 3);
    assert.deepEqual(diagram.viewport, { x: 0, y: 0, zoom: 1 });
    assert.equal(diagram.createdAt, NOW);
    assert.equal(diagram.revision, 0);
  });

  test("imports the legacy TXT board format", () => {
    const raw = JSON.parse(readFileSync(new URL("../fixtures/legacy-board.txt", import.meta.url), "utf8"));
    const diagram = createDiagram(raw);

    assert.equal(diagram.nodes.length, 4);
    assert.equal(diagram.edges.length, 3);
  });

  test("uses the file name when the board has no name", () => {
    const diagram = deserializeDiagram(readFixture("legacy-board.json"), {
      id: "diagram-1",
      fallbackName: "meu-board",
      now: NOW,
      validNodeTypes: VALID_TYPES,
    });

    assert.equal(diagram.name, "meu-board");
  });

  test("round-trips a diagram and keeps metadata", () => {
    const diagram = createDiagram({
      ...(readFixture("legacy-board.json") as Record<string, unknown>),
      name: "Meu diagrama",
      createdAt: "2026-11-01T10:00:00.000Z",
      updatedAt: "2026-11-02T11:00:00.000Z",
      revision: 7,
      viewport: { x: 10, y: 20, zoom: 1.5 },
    });

    const file = serializeDiagram(diagram);
    const restored = createDiagram(file);

    assert.equal(restored.name, "Meu diagrama");
    assert.equal(restored.createdAt, "2026-11-01T10:00:00.000Z");
    assert.equal(restored.updatedAt, "2026-11-02T11:00:00.000Z");
    assert.equal(restored.revision, 7);
    assert.deepEqual(restored.viewport, { x: 10, y: 20, zoom: 1.5 });
    assert.deepEqual(restored.nodes, diagram.nodes);
    assert.deepEqual(restored.edges, diagram.edges);
  });

  test("removes ephemeral and simulation fields from nodes", () => {
    const raw = readFixture("legacy-board.json") as { nodes: Record<string, unknown>[]; edges: unknown[] };
    raw.nodes[0] = {
      ...raw.nodes[0],
      selected: true,
      dragging: true,
      measured: { width: 100, height: 50 },
      data: { ...(raw.nodes[0].data as Record<string, unknown>), status: "ERROR", errorMessage: "falhou" },
    };

    const diagram = createDiagram(raw);
    const node = diagram.nodes[0] as unknown as Record<string, unknown>;
    const data = node.data as Record<string, unknown>;

    assert.equal(node.selected, undefined);
    assert.equal(node.dragging, undefined);
    assert.equal(node.measured, undefined);
    assert.equal(data.status, "IDLE");
    assert.equal(data.errorMessage, undefined);
  });

  test("rejects unknown node types when a type list is provided", () => {
    const raw = readFixture("legacy-board.json") as { nodes: Array<Record<string, unknown>> };
    raw.nodes[0].type = "naoExiste";

    assert.throws(() => createDiagram(raw), /Unknown node type "naoExiste"/);
  });

  test("rejects duplicate node ids", () => {
    const raw = readFixture("legacy-board.json") as { nodes: Array<Record<string, unknown>> };
    raw.nodes[1].id = raw.nodes[0].id;

    assert.throws(() => createDiagram(raw), /Duplicate node id/);
  });

  test("drops edges that point to missing nodes", () => {
    const raw = readFixture("legacy-board.json") as { edges: Array<Record<string, unknown>> };
    raw.edges[0].target = "missing";

    const diagram = createDiagram(raw);
    assert.equal(diagram.edges.length, 2);
  });

  test("preserves unknown fields when re-exporting", () => {
    const raw = {
      ...(readFixture("legacy-board.json") as Record<string, unknown>),
      futureField: { enabled: true },
    };

    const diagram = createDiagram(raw);
    const file = serializeDiagram(diagram) as unknown as Record<string, unknown>;

    assert.deepEqual(file.futureField, { enabled: true });
  });
});

describe("workspace serialization", () => {
  test("serializes and restores all diagrams and the active tab", () => {
    const first = createDiagram(readFixture("legacy-board.json"));
    const second = { ...createDiagram(readFixture("legacy-board.json")), id: "diagram-2", name: "Segundo" };

    const workspace: IWorkspace = {
      schemaVersion: 1,
      activeDiagramId: second.id,
      diagrams: { [first.id]: first, [second.id]: second },
      extra: { futureWorkspaceField: true },
    };

    const file = serializeWorkspace(workspace);
    const restored = deserializeWorkspace(file, { now: NOW, validNodeTypes: VALID_TYPES });

    assert.equal(restored.activeDiagramId, "diagram-2");
    assert.deepEqual(Object.keys(restored.diagrams), ["diagram-1", "diagram-2"]);
    assert.equal(restored.diagrams["diagram-2"].name, "Segundo");
    assert.equal((restored.extra as Record<string, unknown>).futureWorkspaceField, true);
    assert.equal((file.diagrams["diagram-1"] as unknown as Record<string, unknown>).kind, undefined);
  });

  test("falls back to the first diagram when the active id is invalid", () => {
    const diagram = createDiagram(readFixture("legacy-board.json"));
    const file = serializeWorkspace({ schemaVersion: 1, activeDiagramId: "missing", diagrams: { [diagram.id]: diagram } });

    const restored = deserializeWorkspace(file, { now: NOW, validNodeTypes: VALID_TYPES });
    assert.equal(restored.activeDiagramId, "diagram-1");
  });

  test("rejects unsupported schema versions and empty workspaces", () => {
    assert.throws(() => deserializeWorkspace({ schemaVersion: 2, diagrams: {} }, { now: NOW }), /not supported/);
    assert.throws(() => deserializeWorkspace({ schemaVersion: 1, diagrams: {} }, { now: NOW }), /does not contain any diagram/);
    assert.throws(() => deserializeWorkspace({ kind: "diagram", nodes: [], edges: [] }, { now: NOW }), /contains a diagram/);
  });

  test("detects the file kind", () => {
    assert.equal(detectFileKind({ kind: "workspace", diagrams: {} }), "workspace");
    assert.equal(detectFileKind({ kind: "diagram", nodes: [], edges: [] }), "diagram");
    assert.equal(detectFileKind({ nodes: [], edges: [] }), "legacy");
    assert.equal(detectFileKind({ foo: "bar" }), "unknown");
  });
});
