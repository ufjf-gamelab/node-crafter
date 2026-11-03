import React from "react";
import { useReactFlow } from "@xyflow/react";
import { notifications } from "@mantine/notifications";
import type { IEdge, INode } from "@/config/types";
import { i18n } from "@/config/i18n";
import { NodeManager } from "@/utils/node-manager";
import { generateHash } from "@/utils/generate-hash";
import { loadWorkspace, saveWorkspace } from "./storage.ts";
import { deserializeWorkspace, deserializeDiagram, detectFileKind, serializeDiagram, serializeWorkspace } from "./serialization.ts";
import { makeUniqueDiagramName, normalizeDiagramName, getDiagramExportFileName, getWorkspaceExportFileName, getFileBaseName } from "./naming.ts";
import { workspaceReducer } from "./workspace-reducer.ts";
import { downloadJson } from "./download-json.ts";
import type { IDiagram, IDiagramContent, IDiagramViewport, IWorkspace } from "./types.ts";

type SaveStatus = "saving" | "saved" | "error";

type WorkspaceContextValue = {
  workspace: IWorkspace;
  status: SaveStatus;
  pendingExampleSeed: boolean;
  createDiagram: () => void;
  duplicateDiagram: () => void;
  renameDiagram: (name: string) => string;
  closeDiagram: (id: string) => void;
  switchDiagram: (id: string) => void;
  updateActiveContent: (content: IDiagramContent, viewport: IDiagramViewport) => void;
  updateViewport: (viewport: IDiagramViewport) => void;
  markExampleSeeded: () => void;
  flushActive: () => void;
  prepareDiagramImport: (raw: unknown, fileName: string) => IDiagram;
  prepareWorkspaceImport: (raw: unknown) => IWorkspace;
  importDiagram: (raw: unknown, fileName: string) => void;
  replaceWorkspace: (workspace: IWorkspace) => void;
  exportDiagram: () => void;
  exportWorkspace: () => void;
};

const WorkspaceContext = React.createContext<WorkspaceContextValue | undefined>(undefined);

function getNow(): string {
  return new Date().toISOString();
}

function getDiagramNames(workspace: IWorkspace, excludeId?: string): string[] {
  return Object.values(workspace.diagrams)
    .filter((diagram) => diagram.id !== excludeId)
    .map((diagram) => diagram.name);
}

function getValidNodeTypes(): Set<string> {
  return new Set(Object.keys(NodeManager.getNodeTypes()));
}

export const WorkspaceProvider: React.ComponentType<{ children: React.ReactNode }> = ({ children }) => {
  const flow = useReactFlow<INode, IEdge>();

  const [initial] = React.useState(() =>
    loadWorkspace(window.localStorage, {
      initialName: i18n.t("workspace.exampleName"),
      createId: generateHash,
      now: getNow,
    })
  );

  const [workspace, dispatch] = React.useReducer(workspaceReducer, initial.workspace);
  const [status, setStatus] = React.useState<SaveStatus>("saved");
  const [pendingExampleSeed, setPendingExampleSeed] = React.useState(!initial.loaded);
  const saveErrorNotified = React.useRef(false);

  const workspaceRef = React.useRef(workspace);
  workspaceRef.current = workspace;

  React.useEffect(() => {
    if (initial.error) {
      notifications.show({ message: i18n.t("workspace.notifications.corruptWorkspace"), color: "red" });
    }
  }, [initial.error]);

  React.useEffect(() => {
    setStatus("saving");
    const timeout = window.setTimeout(() => {
      try {
        saveWorkspace(window.localStorage, workspaceRef.current);
        setStatus("saved");
        saveErrorNotified.current = false;
      } catch {
        setStatus("error");
        if (!saveErrorNotified.current) {
          notifications.show({ message: i18n.t("workspace.notifications.saveFailed"), color: "red" });
          saveErrorNotified.current = true;
        }
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [workspace]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        saveWorkspace(window.localStorage, workspaceRef.current);
      } catch {
        // The browser may not allow storage access during unload.
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  function flushActive(): void {
    const active = workspaceRef.current.diagrams[workspaceRef.current.activeDiagramId];
    if (!active) return;

    const flowNodes = flow.getNodes();
    const flowEdges = flow.getEdges();
    if (active.nodes.length > 0 && flowNodes.length === 0) return;

    dispatch({
      type: "updateDiagram",
      id: active.id,
      content: { nodes: flowNodes, edges: flowEdges },
      viewport: flow.getViewport(),
      now: getNow(),
    });
  }

  function createDiagram(): void {
    flushActive();
    const name = makeUniqueDiagramName(i18n.t("workspace.defaultName"), getDiagramNames(workspaceRef.current));
    dispatch({ type: "createDiagram", id: generateHash(), name, now: getNow() });
    notifications.show({ message: i18n.t("workspace.notifications.diagramCreated", { name }), color: "green" });
  }

  function duplicateDiagram(): void {
    const active = workspaceRef.current.diagrams[workspaceRef.current.activeDiagramId];
    if (!active) return;

    flushActive();
    const name = makeUniqueDiagramName(i18n.t("workspace.copyName", { name: active.name }), getDiagramNames(workspaceRef.current));
    dispatch({ type: "duplicateDiagram", id: generateHash(), sourceId: active.id, name, now: getNow() });
    notifications.show({ message: i18n.t("workspace.notifications.diagramCreated", { name }), color: "green" });
  }

  function renameDiagram(name: string): string {
    const active = workspaceRef.current.diagrams[workspaceRef.current.activeDiagramId];
    if (!active) return name;

    const fallback = active.name;
    const normalized = normalizeDiagramName(name, fallback);
    const uniqueName = makeUniqueDiagramName(normalized, getDiagramNames(workspaceRef.current, active.id));
    dispatch({ type: "renameDiagram", id: active.id, name: uniqueName, now: getNow() });
    return uniqueName;
  }

  function closeDiagram(id: string): void {
    if (!workspaceRef.current.diagrams[id]) return;

    if (workspaceRef.current.activeDiagramId === id) flushActive();

    const replacementName = makeUniqueDiagramName(i18n.t("workspace.defaultName"), []);
    dispatch({
      type: "closeDiagram",
      id,
      replacementId: generateHash(),
      replacementName,
      now: getNow(),
    });
  }

  function switchDiagram(id: string): void {
    if (!workspaceRef.current.diagrams[id] || id === workspaceRef.current.activeDiagramId) return;
    flushActive();
    dispatch({ type: "setActiveDiagram", id });
  }

  function updateActiveContent(content: IDiagramContent, viewport: IDiagramViewport): void {
    dispatch({ type: "updateDiagram", id: workspaceRef.current.activeDiagramId, content, viewport, now: getNow() });
  }

  function updateViewport(viewport: IDiagramViewport): void {
    dispatch({ type: "updateViewport", id: workspaceRef.current.activeDiagramId, viewport, now: getNow() });
  }

  function markExampleSeeded(): void {
    setPendingExampleSeed(false);
  }

  function prepareDiagramImport(raw: unknown, fileName: string): IDiagram {
    const kind = detectFileKind(raw);
    if (kind === "workspace") throw new Error(i18n.t("workspace.errors.notADiagram"));
    if (kind === "unknown") throw new Error(i18n.t("workspace.errors.invalidFile"));

    const fallbackName = normalizeDiagramName(getFileBaseName(fileName), i18n.t("workspace.defaultName"));
    const diagram = deserializeDiagram(raw, {
      id: generateHash(),
      fallbackName,
      now: getNow(),
      validNodeTypes: getValidNodeTypes(),
    });

    return {
      ...diagram,
      name: makeUniqueDiagramName(diagram.name, getDiagramNames(workspaceRef.current)),
    };
  }

  function prepareWorkspaceImport(raw: unknown): IWorkspace {
    const kind = detectFileKind(raw);
    if (kind === "diagram" || kind === "legacy") throw new Error(i18n.t("workspace.errors.notAWorkspace"));
    if (kind === "unknown") throw new Error(i18n.t("workspace.errors.invalidFile"));

    return deserializeWorkspace(raw, { now: getNow(), validNodeTypes: getValidNodeTypes() });
  }

  function importDiagram(raw: unknown, fileName: string): void {
    flushActive();
    const diagram = prepareDiagramImport(raw, fileName);
    dispatch({ type: "addDiagram", diagram });
    setPendingExampleSeed(false);
    notifications.show({ message: i18n.t("workspace.notifications.diagramImported", { name: diagram.name }), color: "green" });
  }

  function replaceWorkspace(workspaceToImport: IWorkspace): void {
    dispatch({ type: "replaceWorkspace", workspace: workspaceToImport });
    setPendingExampleSeed(false);
    notifications.show({ message: i18n.t("workspace.notifications.workspaceImported", { count: Object.keys(workspaceToImport.diagrams).length }), color: "green" });
  }

  function exportDiagram(): void {
    const active = workspaceRef.current.diagrams[workspaceRef.current.activeDiagramId];
    if (!active) return;

    try {
      const snapshot: IDiagram = {
        ...active,
        nodes: flow.getNodes(),
        edges: flow.getEdges(),
        viewport: flow.getViewport(),
        updatedAt: getNow(),
      };

      dispatch({ type: "updateDiagram", id: active.id, content: { nodes: snapshot.nodes, edges: snapshot.edges }, viewport: snapshot.viewport, now: snapshot.updatedAt });
      downloadJson(serializeDiagram(snapshot), getDiagramExportFileName(active.name));
      notifications.show({ message: i18n.t("workspace.notifications.diagramExported", { name: active.name }), color: "green" });
    } catch (error) {
      notifications.show({ message: i18n.t("workspace.notifications.exportFailed", { message: getErrorMessage(error) }), color: "red" });
    }
  }

  function exportWorkspace(): void {
    const active = workspaceRef.current.diagrams[workspaceRef.current.activeDiagramId];
    if (!active) return;

    try {
      const activeSnapshot: IDiagram = {
        ...active,
        nodes: flow.getNodes(),
        edges: flow.getEdges(),
        viewport: flow.getViewport(),
        updatedAt: getNow(),
      };

      const workspaceSnapshot: IWorkspace = {
        ...workspaceRef.current,
        activeDiagramId: workspaceRef.current.activeDiagramId,
        diagrams: { ...workspaceRef.current.diagrams, [active.id]: activeSnapshot },
      };

      dispatch({ type: "updateDiagram", id: active.id, content: { nodes: activeSnapshot.nodes, edges: activeSnapshot.edges }, viewport: activeSnapshot.viewport, now: activeSnapshot.updatedAt });
      downloadJson(serializeWorkspace(workspaceSnapshot), getWorkspaceExportFileName());
      notifications.show({ message: i18n.t("workspace.notifications.workspaceExported", { name: "node-crafter-workspace" }), color: "green" });
    } catch (error) {
      notifications.show({ message: i18n.t("workspace.notifications.exportFailed", { message: getErrorMessage(error) }), color: "red" });
    }
  }

  const value: WorkspaceContextValue = {
    workspace,
    status,
    pendingExampleSeed,
    createDiagram,
    duplicateDiagram,
    renameDiagram,
    closeDiagram,
    switchDiagram,
    updateActiveContent,
    updateViewport,
    markExampleSeeded,
    flushActive,
    prepareDiagramImport,
    prepareWorkspaceImport,
    importDiagram,
    replaceWorkspace,
    exportDiagram,
    exportWorkspace,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export function useWorkspace(): WorkspaceContextValue {
  const context = React.useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return context;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
