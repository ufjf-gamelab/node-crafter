import type { IEdge, INode } from "@/config/types";
import { deepClone } from "../../utils/deep-clone.ts";
import { generateHash } from "../../utils/generate-hash.ts";
import { sanitizeEdge, sanitizeNode } from "./serialization.ts";

export const CLIPBOARD_KIND = "node-crafter/clipboard";
export const CLIPBOARD_VERSION = 1;
export const CLIPBOARD_OFFSET = 24;

export type IClipboardPayload = {
  kind: typeof CLIPBOARD_KIND;
  version: typeof CLIPBOARD_VERSION;
  nodes: INode[];
  edges: IEdge[];
};

export type IMaterializeClipboardOptions = {
  generateId?: () => string;
  offset?: { x: number; y: number };
};

/**
 * Copies the selected nodes and the edges that connect two selected nodes.
 * The result is a plain JSON payload that can be pasted into any diagram.
 */
export function createClipboardPayload(nodes: INode[], edges: IEdge[]): IClipboardPayload | null {
  const selectedNodes = nodes.filter((node) => node.selected);
  if (selectedNodes.length === 0) return null;

  const selectedIds = new Set(selectedNodes.map((node) => node.id));
  const selectedEdges = edges.filter((edge) => selectedIds.has(edge.source) && selectedIds.has(edge.target));

  return {
    kind: CLIPBOARD_KIND,
    version: CLIPBOARD_VERSION,
    nodes: selectedNodes.map((node) => deepClone(sanitizeNode(node))),
    edges: selectedEdges.map((edge) => deepClone(sanitizeEdge(edge))),
  };
}

/**
 * Rebuilds a clipboard payload with fresh ids, so the pasted elements never
 * collide with the originals. Handle ids that embed the node id are remapped too.
 */
export function materializeClipboard(
  payload: IClipboardPayload,
  options: IMaterializeClipboardOptions = {}
): { nodes: INode[]; edges: IEdge[] } {
  const generateId = options.generateId ?? generateHash;
  const offset = options.offset ?? { x: CLIPBOARD_OFFSET, y: CLIPBOARD_OFFSET };
  const idMap = new Map<string, string>();

  const nodes = payload.nodes.map((node) => {
    const id = generateId();
    idMap.set(node.id, id);

    return {
      ...deepClone(node),
      id,
      position: { x: node.position.x + offset.x, y: node.position.y + offset.y },
      selected: true,
    } as INode;
  });

  const edges = payload.edges
    .filter((edge) => idMap.has(edge.source) && idMap.has(edge.target))
    .map(
      (edge) =>
        ({
          ...deepClone(edge),
          id: generateId(),
          source: idMap.get(edge.source) as string,
          target: idMap.get(edge.target) as string,
          sourceHandle: remapHandle(edge.sourceHandle, idMap),
          targetHandle: remapHandle(edge.targetHandle, idMap),
          selected: false,
        }) as IEdge
    );

  return { nodes, edges };
}

export function isClipboardPayload(value: unknown): value is IClipboardPayload {
  if (typeof value !== "object" || value === null) return false;

  const payload = value as Record<string, unknown>;
  return payload.kind === CLIPBOARD_KIND && Array.isArray(payload.nodes) && Array.isArray(payload.edges);
}

function remapHandle(handle: string | null | undefined, idMap: Map<string, string>): string | null | undefined {
  if (!handle) return handle;

  const entries = [...idMap.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [oldId, newId] of entries) {
    if (handle === oldId) return newId;
    if (!handle.endsWith(oldId)) continue;

    const prefix = handle.slice(0, handle.length - oldId.length);
    return prefix + newId;
  }

  return handle;
}

let clipboard: IClipboardPayload | null = null;

export function setWorkspaceClipboard(payload: IClipboardPayload): void {
  clipboard = payload;
}

export function getWorkspaceClipboard(): IClipboardPayload | null {
  return clipboard;
}

export async function writeClipboardToSystem(payload: IClipboardPayload): Promise<void> {
  try {
    await navigator.clipboard?.writeText(JSON.stringify(payload));
  } catch {
    // The internal clipboard still works when the browser denies access.
  }
}

export async function readClipboardFromSystem(): Promise<IClipboardPayload | null> {
  try {
    const text = await navigator.clipboard?.readText();
    if (!text) return null;

    const parsed: unknown = JSON.parse(text);
    return isClipboardPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
