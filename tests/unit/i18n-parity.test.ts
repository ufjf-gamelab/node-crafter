import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";

const en = JSON.parse(readFileSync(new URL("../../src/locale/translations/en.json", import.meta.url), "utf8")) as Record<string, unknown>;
const pt = JSON.parse(readFileSync(new URL("../../src/locale/translations/pt-br.json", import.meta.url), "utf8")) as Record<string, unknown>;

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

describe("translation parity", () => {
  test("English and Portuguese have the same translation keys", () => {
    const englishKeys = flattenKeys(en).sort();
    const portugueseKeys = flattenKeys(pt).sort();

    assert.deepEqual(portugueseKeys, englishKeys);
  });

  test("workspace strings exist in both languages", () => {
    const englishKeys = flattenKeys(en);
    assert.ok(englishKeys.includes("workspace.defaultName"));
    assert.ok(englishKeys.includes("workspace.notifications.diagramImported"));
  });
});
