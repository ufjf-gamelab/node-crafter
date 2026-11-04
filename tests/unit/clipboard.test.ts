import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  CLIPBOARD_KIND,
  CLIPBOARD_OFFSET,
  createClipboardPayload,
  isClipboardPayload,
  materializeClipboard,
  type IClipboardPayload,
} from "../../src/features/workspace/clipboard.ts";
import type { IEdge, INode } from "../../src/config/types.ts";

function makeNode(id: string, selected: boolean, data: Record<string, unknown> = {}): INode {
  return {
    id,
    type: "diceGenerator",
    position: { x: 10, y: 20 },
    selected,
    data: { name: id, status: "FINISHED", min: 1, max: 6, ...data },
  } as unknown as INode;
}

function makeEdge(id: string, source: string, target: string, targetHandle?: string): IEdge {
  return { id, source, target, targetHandle } as IEdge;
}

describe("workspace clipboard", () => {
  test("copies only selected nodes and the edges between them", () => {
    const nodes = [makeNode("a", true), makeNode("b", true), makeNode("c", false)];
    const edges = [makeEdge("e1", "a", "b", "math-target-1-b"), makeEdge("e2", "b", "c")];

    const payload = createClipboardPayload(nodes, edges);

    assert.ok(payload);
    assert.equal(payload.kind, CLIPBOARD_KIND);
    assert.deepEqual(
      payload.nodes.map((node) => node.id),
      ["a", "b"]
    );
    assert.deepEqual(
      payload.edges.map((edge) => edge.id),
      ["e1"]
    );
  });

  test("returns null when nothing is selected", () => {
    assert.equal(createClipboardPayload([makeNode("a", false)], []), null);
  });

  test("copies a snapshot that does not share state with the originals", () => {
    const nodes = [makeNode("a", true, { values: [1, 2, 3] })];
    const payload = createClipboardPayload(nodes, []);
    assert.ok(payload);

    const sourceData = nodes[0].data as unknown as { max: number; values: number[] };
    sourceData.max = 99;
    sourceData.values.push(4);

    const copiedData = payload.nodes[0].data as unknown as { max: number; values: number[] };
    assert.equal(copiedData.max, 6);
    assert.deepEqual(copiedData.values, [1, 2, 3]);
    assert.equal(payload.nodes[0].selected, undefined);
    assert.equal(payload.nodes[0].data.status, "IDLE");
  });

  test("materializes with fresh ids, offset positions and remapped handles", () => {
    const payload: IClipboardPayload = {
      kind: CLIPBOARD_KIND,
      version: 1,
      nodes: [makeNode("a", false), makeNode("b", false)],
      edges: [makeEdge("e1", "a", "b", "math-target-1-b")],
    };

    let counter = 0;
    const result = materializeClipboard(payload, {
      generateId: () => `new-${(counter += 1)}`,
      offset: { x: 100, y: 50 },
    });

    assert.deepEqual(
      result.nodes.map((node) => node.id),
      ["new-1", "new-2"]
    );
    assert.deepEqual(result.nodes[0].position, { x: 10 + 100, y: 20 + 50 });
    assert.equal(result.nodes[0].selected, true);

    assert.equal(result.edges.length, 1);
    assert.equal(result.edges[0].id, "new-3");
    assert.equal(result.edges[0].source, "new-1");
    assert.equal(result.edges[0].target, "new-2");
    assert.equal(result.edges[0].targetHandle, "math-target-1-new-2");
  });

  test("uses the default paste offset and drops edges to missing nodes", () => {
    const payload: IClipboardPayload = {
      kind: CLIPBOARD_KIND,
      version: 1,
      nodes: [makeNode("a", false)],
      edges: [makeEdge("e1", "a", "missing")],
    };

    let counter = 0;
    const result = materializeClipboard(payload, { generateId: () => `new-${(counter += 1)}` });

    assert.deepEqual(result.nodes[0].position, { x: 10 + CLIPBOARD_OFFSET, y: 20 + CLIPBOARD_OFFSET });
    assert.deepEqual(result.edges, []);
  });

  test("validates payloads", () => {
    assert.equal(isClipboardPayload({ kind: CLIPBOARD_KIND, version: 1, nodes: [], edges: [] }), true);
    assert.equal(isClipboardPayload({ kind: "other", version: 1, nodes: [], edges: [] }), false);
    assert.equal(isClipboardPayload({ kind: CLIPBOARD_KIND, nodes: [] }), false);
    assert.equal(isClipboardPayload(null), false);
    assert.equal(isClipboardPayload("node-crafter"), false);
  });
});
