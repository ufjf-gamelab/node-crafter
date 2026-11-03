import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  MAX_DIAGRAM_NAME_LENGTH,
  getDiagramExportFileName,
  getFileBaseName,
  getWorkspaceExportFileName,
  makeUniqueDiagramName,
  normalizeDiagramName,
  slugifyFileName,
} from "../../src/features/workspace/naming.ts";

describe("workspace naming", () => {
  test("normalizes whitespace and falls back for empty names", () => {
    assert.equal(normalizeDiagramName("  Meu   diagrama  ", "Novo Diagrama"), "Meu diagrama");
    assert.equal(normalizeDiagramName("   ", "Novo Diagrama"), "Novo Diagrama");
    assert.equal(normalizeDiagramName("x".repeat(MAX_DIAGRAM_NAME_LENGTH + 10), "fallback").length, MAX_DIAGRAM_NAME_LENGTH);
  });

  test("adds a numeric suffix when the name already exists", () => {
    assert.equal(makeUniqueDiagramName("Diagrama", ["Outro"]), "Diagrama");
    assert.equal(makeUniqueDiagramName("Diagrama", ["Diagrama"]), "Diagrama 2");
    assert.equal(makeUniqueDiagramName("Diagrama", ["diagrama", "Diagrama 2"]), "Diagrama 3");
  });

  test("keeps the suffix inside the length limit", () => {
    const base = "a".repeat(MAX_DIAGRAM_NAME_LENGTH);
    const unique = makeUniqueDiagramName(base, [base]);

    assert.equal(unique.length, MAX_DIAGRAM_NAME_LENGTH);
    assert.match(unique, / 2$/);
  });

  test("extracts file names and creates readable slugs", () => {
    assert.equal(getFileBaseName("meu-diagrama.json"), "meu-diagrama");
    assert.equal(getFileBaseName("sem-extensao"), "sem-extensao");
    assert.equal(slugifyFileName("Ação & Reação"), "acao-reacao");
    assert.equal(slugifyFileName("!!!"), "diagram");
    assert.equal(getDiagramExportFileName("Meu Diagrama"), "node-crafter-meu-diagrama.json");
    assert.equal(getWorkspaceExportFileName(new Date("2026-11-03T12:00:00.000Z")), "node-crafter-workspace-2026-11-03.json");
  });
});
