import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { alignNodes } from "../../src/features/workspace/alignment.ts";
import type { INode } from "../../src/config/types.ts";

function makeNode(id: string, selected: boolean, x: number, y: number, width = 100, height = 50): INode {
  return {
    id,
    type: "diceGenerator",
    position: { x, y },
    selected,
    measured: { width, height },
    data: { name: id, status: "IDLE" },
  } as unknown as INode;
}

describe("node alignment", () => {
  test("does nothing when fewer than 2 nodes are selected", () => {
    const nodes = [makeNode("a", true, 0, 0), makeNode("b", false, 50, 50)];
    const result = alignNodes(nodes, "left");
    assert.deepEqual(result, nodes);
  });

  test("aligns left", () => {
    const nodes = [makeNode("a", true, 30, 10), makeNode("b", true, 10, 50)];
    const result = alignNodes(nodes, "left");
    assert.equal(result[0].position.x, 10);
    assert.equal(result[1].position.x, 10);
  });

  test("aligns right", () => {
    const nodes = [
      makeNode("a", true, 10, 10, 100, 50), // right edge = 110
      makeNode("b", true, 20, 50, 50, 50),  // right edge = 70
    ];
    const result = alignNodes(nodes, "right");
    assert.equal(result[0].position.x, 10);      // 110 - 100 = 10
    assert.equal(result[1].position.x, 60);      // 110 - 50 = 60
  });

  test("aligns top", () => {
    const nodes = [makeNode("a", true, 10, 40), makeNode("b", true, 50, 20)];
    const result = alignNodes(nodes, "top");
    assert.equal(result[0].position.y, 20);
    assert.equal(result[1].position.y, 20);
  });

  test("aligns bottom", () => {
    const nodes = [
      makeNode("a", true, 10, 10, 100, 40), // bottom edge = 50
      makeNode("b", true, 50, 20, 100, 60), // bottom edge = 80
    ];
    const result = alignNodes(nodes, "bottom");
    assert.equal(result[0].position.y, 40); // 80 - 40 = 40
    assert.equal(result[1].position.y, 20); // 80 - 60 = 20
  });

  test("aligns center horizontal", () => {
    const nodes = [
      makeNode("a", true, 0, 0, 100, 50),   // center x = 50
      makeNode("b", true, 100, 0, 200, 50), // center x = 200 (span 0 to 300, mid = 150)
    ];
    // minX = 0, maxX = 300, mid = 150
    const result = alignNodes(nodes, "centerHorizontal");
    assert.equal(result[0].position.x, 100); // 150 - 100/2 = 100
    assert.equal(result[1].position.x, 50);  // 150 - 200/2 = 50
  });
});
