import type { IEdge, INode } from "@/config/types";
import { DEFAULT_VIEWPORT, normalizeDiagramName } from "./naming.ts";
import type {
  IDiagram,
  IDiagramFile,
  IDiagramViewport,
  IWorkspace,
  IWorkspaceFile,
  IWorkspaceFileKind,
} from "./types.ts";

const NODE_PERSISTED_KEYS = [
  "id",
  "type",
  "position",
  "data",
  "parentId",
  "extent",
  "expandParent",
  "hidden",
  "draggable",
  "selectable",
  "connectable",
  "style",
  "className",
  "zIndex",
] as const;

const EDGE_PERSISTED_KEYS = [
  "id",
  "source",
  "target",
  "sourceHandle",
  "targetHandle",
  "type",
  "data",
  "animated",
  "hidden",
  "style",
  "markerEnd",
  "markerStart",
  "zIndex",
  "label",
  "labelStyle",
  "labelShowBg",
  "labelBgStyle",
  "interactionWidth",
  "focusable",
  "selectable",
  "deletable",
  "reconnectable",
] as const;

const DIAGRAM_KEYS = ["kind", "schemaVersion", "id", "name", "createdAt", "updatedAt", "revision", "viewport", "nodes", "edges"] as const;
const WORKSPACE_KEYS = ["kind", "schemaVersion", "activeDiagramId", "diagrams"] as const;

export type IDiagramDeserializeOptions = {
  id: string;
  fallbackName: string;
  now: string;
  validNodeTypes?: ReadonlySet<string>;
};

export type IWorkspaceDeserializeOptions = {
  now: string;
  validNodeTypes?: ReadonlySet<string>;
};

export function detectFileKind(raw: unknown): IWorkspaceFileKind {
  if (!isRecord(raw)) return "unknown";
  if (raw.kind === "workspace" || isRecord(raw.diagrams)) return "workspace";
  if (raw.kind === "diagram") return "diagram";
  if (Array.isArray(raw.nodes) || Array.isArray(raw.edges)) return "legacy";
  return "unknown";
}

export function deserializeDiagram(raw: unknown, options: IDiagramDeserializeOptions): IDiagram {
  if (!isRecord(raw)) throw new Error("Invalid diagram file.");
  if (raw.kind === "workspace" || isRecord(raw.diagrams)) throw new Error("This file contains a workspace, not a single diagram.");

  const now = options.now;
  const nodes = parseNodes(raw.nodes, options.validNodeTypes);
  const edges = parseEdges(raw.edges, new Set(nodes.map((node) => node.id)));

  return {
    id: options.id,
    name: normalizeDiagramName(readString(raw.name) ?? options.fallbackName, options.fallbackName),
    createdAt: readDate(raw.createdAt, now),
    updatedAt: readDate(raw.updatedAt, now),
    revision: readRevision(raw.revision),
    viewport: readViewport(raw.viewport),
    nodes,
    edges,
    extra: pickExtra(raw, DIAGRAM_KEYS),
  };
}

export function deserializeWorkspace(raw: unknown, options: IWorkspaceDeserializeOptions): IWorkspace {
  if (!isRecord(raw)) throw new Error("Invalid workspace file.");
  if (raw.kind === "diagram") throw new Error("This file contains a diagram, not a workspace.");
  if (!isRecord(raw.diagrams)) throw new Error("Workspace file does not contain diagrams.");

  assertSupportedSchemaVersion(raw.schemaVersion);

  const diagrams: Record<string, IDiagram> = {};
  for (const [id, entry] of Object.entries(raw.diagrams)) {
    if (!isRecord(entry)) throw new Error(`Invalid diagram entry "${id}".`);
    diagrams[id] = deserializeDiagram({ ...entry, id }, { id, fallbackName: id, now: options.now, validNodeTypes: options.validNodeTypes });
  }

  const diagramIds = Object.keys(diagrams);
  if (diagramIds.length === 0) throw new Error("Workspace file does not contain any diagram.");

  const activeDiagramId = typeof raw.activeDiagramId === "string" && diagrams[raw.activeDiagramId] ? raw.activeDiagramId : diagramIds[0];

  return {
    schemaVersion: 1,
    activeDiagramId,
    diagrams,
    extra: pickExtra(raw, WORKSPACE_KEYS),
  };
}

export function serializeDiagram(diagram: IDiagram): IDiagramFile {
  return {
    kind: "diagram",
    schemaVersion: 1,
    ...diagram.extra,
    id: diagram.id,
    name: diagram.name,
    createdAt: diagram.createdAt,
    updatedAt: diagram.updatedAt,
    revision: diagram.revision,
    viewport: diagram.viewport,
    nodes: diagram.nodes.map(sanitizeNode),
    edges: diagram.edges.map(sanitizeEdge),
  };
}

export function serializeWorkspace(workspace: IWorkspace): IWorkspaceFile {
  const diagrams = Object.entries(workspace.diagrams).reduce<IWorkspaceFile["diagrams"]>((accumulator, [id, diagram]) => {
    const file = serializeDiagram({ ...diagram, id });
    accumulator[id] = {
      id: file.id,
      name: file.name,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      revision: file.revision,
      viewport: file.viewport,
      nodes: file.nodes,
      edges: file.edges,
    };
    return accumulator;
  }, {});

  return {
    kind: "workspace",
    schemaVersion: 1,
    ...workspace.extra,
    activeDiagramId: workspace.activeDiagramId,
    diagrams,
  };
}

export function sanitizeNode(node: INode): INode {
  const raw = node as unknown as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const key of NODE_PERSISTED_KEYS) {
    if (raw[key] !== undefined) result[key] = raw[key];
  }

  result.data = sanitizeNodeData(raw.data, readString(raw.type) ?? "unknown");
  return result as INode;
}

export function sanitizeEdge(edge: IEdge): IEdge {
  const raw = edge as unknown as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const key of EDGE_PERSISTED_KEYS) {
    if (raw[key] !== undefined) result[key] = raw[key];
  }

  return result as IEdge;
}

function parseNodes(rawNodes: unknown, validNodeTypes?: ReadonlySet<string>): INode[] {
  if (!Array.isArray(rawNodes)) throw new Error("Diagram nodes must be a list.");

  const nodeIds = new Set<string>();
  return rawNodes.map((rawNode, index) => {
    if (!isRecord(rawNode)) throw new Error(`Invalid node at position ${index}.`);

    const id = readNonEmptyString(rawNode.id);
    if (!id) throw new Error(`Node at position ${index} is missing an id.`);
    if (nodeIds.has(id)) throw new Error(`Duplicate node id "${id}".`);
    nodeIds.add(id);

    const type = readNonEmptyString(rawNode.type);
    if (!type) throw new Error(`Node "${id}" is missing a type.`);
    if (validNodeTypes && !validNodeTypes.has(type)) throw new Error(`Unknown node type "${type}" in node "${id}".`);

    const position = readPosition(rawNode.position);
    if (!position) throw new Error(`Node "${id}" has an invalid position.`);

    const result: Record<string, unknown> = {};
    for (const key of NODE_PERSISTED_KEYS) {
      if (rawNode[key] !== undefined) result[key] = rawNode[key];
    }

    result.id = id;
    result.type = type;
    result.position = position;
    result.data = sanitizeNodeData(rawNode.data, type);
    return result as INode;
  });
}

function parseEdges(rawEdges: unknown, nodeIds: Set<string>): IEdge[] {
  if (!Array.isArray(rawEdges)) throw new Error("Diagram edges must be a list.");

  const edgeIds = new Set<string>();
  const edges: IEdge[] = [];

  rawEdges.forEach((rawEdge, index) => {
    if (!isRecord(rawEdge)) throw new Error(`Invalid edge at position ${index}.`);

    const source = readNonEmptyString(rawEdge.source);
    const target = readNonEmptyString(rawEdge.target);
    if (!source || !target) throw new Error(`Edge at position ${index} is missing source or target.`);
    if (!nodeIds.has(source) || !nodeIds.has(target)) return;

    const id = readNonEmptyString(rawEdge.id) ?? `edge-${source}-${target}-${index}`;
    if (edgeIds.has(id)) throw new Error(`Duplicate edge id "${id}".`);
    edgeIds.add(id);

    const result: Record<string, unknown> = {};
    for (const key of EDGE_PERSISTED_KEYS) {
      if (rawEdge[key] !== undefined) result[key] = rawEdge[key];
    }

    result.id = id;
    result.source = source;
    result.target = target;
    edges.push(result as IEdge);
  });

  return edges;
}

function sanitizeNodeData(rawData: unknown, type: string): Record<string, unknown> {
  const data = isRecord(rawData) ? { ...rawData } : {};
  const name = readString(data.name) ?? type;

  delete data.errorMessage;
  return { ...data, name, status: "IDLE" };
}

function readPosition(value: unknown): { x: number; y: number } | undefined {
  if (!isRecord(value)) return undefined;

  const x = readFiniteNumber(value.x);
  const y = readFiniteNumber(value.y);
  if (x === undefined || y === undefined) return undefined;

  return { x, y };
}

function readViewport(value: unknown): IDiagramViewport {
  if (!isRecord(value)) return { ...DEFAULT_VIEWPORT };

  const x = readFiniteNumber(value.x);
  const y = readFiniteNumber(value.y);
  const zoom = readFiniteNumber(value.zoom);

  if (x === undefined || y === undefined || zoom === undefined || zoom <= 0) return { ...DEFAULT_VIEWPORT };
  return { x, y, zoom };
}

function readDate(value: unknown, fallback: string): string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return fallback;
  return value;
}

function readRevision(value: unknown): number {
  const revision = readFiniteNumber(value);
  if (revision === undefined || revision < 0) return 0;
  return Math.floor(revision);
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readNonEmptyString(value: unknown): string | undefined {
  const text = readString(value)?.trim();
  return text || undefined;
}

function readFiniteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function pickExtra(raw: Record<string, unknown>, knownKeys: readonly string[]): Record<string, unknown> | undefined {
  const known = new Set(knownKeys);
  const extra = Object.fromEntries(Object.entries(raw).filter(([key]) => !known.has(key)));
  return Object.keys(extra).length > 0 ? extra : undefined;
}

function assertSupportedSchemaVersion(value: unknown): void {
  if (value === undefined) return;
  if (typeof value !== "number" || !Number.isInteger(value)) throw new Error("Invalid workspace schema version.");
  if (value > 1) throw new Error(`Workspace schema version ${value} is not supported.`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
