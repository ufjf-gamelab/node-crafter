import type { IEdge, INode } from "@/config/types";

export type IDiagramViewport = {
  x: number;
  y: number;
  zoom: number;
};

export type IDiagramContent = {
  nodes: INode[];
  edges: IEdge[];
};

export type IDiagram = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  viewport: IDiagramViewport;
  nodes: INode[];
  edges: IEdge[];
  extra?: Record<string, unknown>;
};

export type IWorkspace = {
  schemaVersion: 1;
  activeDiagramId: string;
  diagrams: Record<string, IDiagram>;
  extra?: Record<string, unknown>;
};

export type IDiagramFile = {
  kind: "diagram";
  schemaVersion: 1;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  viewport: IDiagramViewport;
  nodes: INode[];
  edges: IEdge[];
};

export type IWorkspaceDiagramFile = Omit<IDiagramFile, "kind" | "schemaVersion">;

export type IWorkspaceFile = {
  kind: "workspace";
  schemaVersion: 1;
  activeDiagramId: string;
  diagrams: Record<string, IWorkspaceDiagramFile>;
};

export type IWorkspaceFileKind = "diagram" | "workspace" | "legacy" | "unknown";
