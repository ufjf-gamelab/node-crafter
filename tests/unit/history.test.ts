import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { DEFAULT_HISTORY_LIMIT, createHistory } from "../../src/features/workspace/history.ts";

describe("workspace history", () => {
  test("walks back and forward through committed states", () => {
    const history = createHistory<string>();

    history.push("a");
    history.push("b");

    assert.equal(history.canUndo(), true);
    assert.equal(history.undo("c"), "b");
    assert.equal(history.undo("b"), "a");
    assert.equal(history.undo("a"), null);
    assert.equal(history.canUndo(), false);

    assert.equal(history.canRedo(), true);
    assert.equal(history.redo("a"), "b");
    assert.equal(history.redo("b"), "c");
    assert.equal(history.redo("c"), null);
    assert.equal(history.canRedo(), false);
  });

  test("keeps only the last 20 states", () => {
    const history = createHistory<number>(DEFAULT_HISTORY_LIMIT);

    for (let index = 0; index < 25; index += 1) history.push(index);
    assert.equal(history.size(), DEFAULT_HISTORY_LIMIT);

    let current = 25;
    for (let expected = 24; expected >= 5; expected -= 1) {
      assert.equal(history.undo(current), expected);
      current = expected;
    }

    assert.equal(history.undo(current), null);
    assert.equal(history.size(), 0);
  });

  test("a new change clears the redo stack", () => {
    const history = createHistory<string>();

    history.push("a");
    assert.equal(history.undo("b"), "a");
    assert.equal(history.canRedo(), true);

    history.push("a");
    assert.equal(history.canRedo(), false);
  });

  test("reset empties both stacks", () => {
    const history = createHistory<string>();

    history.push("a");
    history.undo("b");
    history.reset();

    assert.equal(history.canUndo(), false);
    assert.equal(history.canRedo(), false);
    assert.equal(history.size(), 0);
  });
});
