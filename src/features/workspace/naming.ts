export const MAX_DIAGRAM_NAME_LENGTH = 80;
export const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 };

export function normalizeDiagramName(value: string, fallback: string): string {
  const normalized = value.replace(/\s+/g, " ").trim().slice(0, MAX_DIAGRAM_NAME_LENGTH);
  return normalized || fallback;
}

export function makeUniqueDiagramName(baseName: string, existingNames: Iterable<string>): string {
  const normalizedBase = normalizeDiagramName(baseName, baseName);
  const existing = new Set(Array.from(existingNames, (name) => name.toLocaleLowerCase()));

  if (!existing.has(normalizedBase.toLocaleLowerCase())) return normalizedBase;

  let index = 2;
  let candidate = appendSuffix(normalizedBase, index);
  while (existing.has(candidate.toLocaleLowerCase())) {
    index += 1;
    candidate = appendSuffix(normalizedBase, index);
  }

  return candidate;
}

export function getFileBaseName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  return withoutExtension.trim();
}

export function slugifyFileName(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "diagram";
}

export function getDiagramExportFileName(name: string): string {
  return `node-crafter-${slugifyFileName(name)}.json`;
}

export function getWorkspaceExportFileName(date = new Date()): string {
  return `node-crafter-workspace-${date.toISOString().slice(0, 10)}.json`;
}

function appendSuffix(baseName: string, index: number): string {
  const suffix = ` ${index}`;
  return `${baseName.slice(0, MAX_DIAGRAM_NAME_LENGTH - suffix.length).trimEnd()}${suffix}`;
}
