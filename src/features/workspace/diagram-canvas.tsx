import React from "react";
import { Background, BackgroundVariant, Connection, MarkerType, ReactFlow, addEdge, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { NodeManager } from "@/utils/node-manager";
import { generateHash } from "@/utils/generate-hash";
import { deepClone } from "@/utils/deep-clone";
import { useSimulationContext } from "@/contexts/simulation-context";
import { useWorkspace } from "./workspace-provider.tsx";
import { createHistory, type IHistory } from "./history.ts";
import {
  CLIPBOARD_OFFSET,
  createClipboardPayload,
  getWorkspaceClipboard,
  materializeClipboard,
  readClipboardFromSystem,
  setWorkspaceClipboard,
  writeClipboardToSystem,
  type IClipboardPayload,
} from "./clipboard.ts";
import { isCopyShortcut, isPasteShortcut, isRedoShortcut, isUndoShortcut } from "./shortcuts.ts";
import { sanitizeEdge, sanitizeNode } from "./serialization.ts";
import type { IEdge, INode, IIntegerValueNode } from "@/config/types";
import type { IDiagramContent } from "./types.ts";

const HISTORY_LIMIT = 20;
const HISTORY_DEBOUNCE = 400;

type IHistoryEntry = {
  history: IHistory<IDiagramContent>;
  content: IDiagramContent;
  signature: string;
};

function snapshotContent(content: IDiagramContent): IDiagramContent {
  return {
    nodes: content.nodes.map((node) => deepClone(sanitizeNode(node))),
    edges: content.edges.map((edge) => deepClone(sanitizeEdge(edge))),
  };
}

function contentSignature(content: IDiagramContent): string {
  return JSON.stringify(content);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select";
}

export const DiagramCanvas: React.ComponentType = () => {
  const flow = useReactFlow<INode, IEdge>();
  const { workspace, pendingExampleSeed, markExampleSeeded, updateActiveContent, updateViewport } = useWorkspace();
  const { loading, clearSimulation } = useSimulationContext();

  const activeId = workspace.activeDiagramId;
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<IEdge>([]);
  const hydratedDiagramIdRef = React.useRef<string | null>(null);
  const hydratingRef = React.useRef(false);
  const seededRef = React.useRef(false);
  const restoringRef = React.useRef(false);
  const historiesRef = React.useRef(new Map<string, IHistoryEntry>());
  const pasteStateRef = React.useRef<{ payload: IClipboardPayload | null; count: number }>({ payload: null, count: 0 });

  const resetHistory = React.useCallback((diagramId: string, content: IDiagramContent) => {
    const snapshot = snapshotContent(content);
    historiesRef.current.set(diagramId, {
      history: createHistory<IDiagramContent>(HISTORY_LIMIT),
      content: snapshot,
      signature: contentSignature(snapshot),
    });
  }, []);

  const getHistoryEntry = React.useCallback((diagramId: string): IHistoryEntry => {
    const existing = historiesRef.current.get(diagramId);
    if (existing) return existing;

    const emptyContent: IDiagramContent = { nodes: [], edges: [] };
    const created: IHistoryEntry = {
      history: createHistory<IDiagramContent>(HISTORY_LIMIT),
      content: emptyContent,
      signature: contentSignature(emptyContent),
    };
    historiesRef.current.set(diagramId, created);
    return created;
  }, []);

  React.useEffect(() => {
    if (!pendingExampleSeed || seededRef.current) return;
    seededRef.current = true;
    hydratedDiagramIdRef.current = workspace.activeDiagramId;

    const dice = NodeManager.new("diceGenerator", flow);
    dice.position = { x: 20, y: -40 };

    const diceMath = NodeManager.new("diceMath", flow);
    diceMath.position = { x: 200, y: 20 };

    const integerValue = NodeManager.new("integerValue", flow) as IIntegerValueNode;
    integerValue.position = { x: 20, y: 80 };
    integerValue.data.value = 4;

    const histogram = NodeManager.new("histogram", flow);
    histogram.position = { x: 360, y: 20 };

    const exampleEdges: IEdge[] = [
      {
        id: generateHash(),
        source: dice.id,
        target: diceMath.id,
        targetHandle: `math-target-1-${diceMath.id}`,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
        style: { strokeWidth: 2 },
      } as IEdge,
      {
        id: generateHash(),
        source: integerValue.id,
        target: diceMath.id,
        targetHandle: `math-target-2-${diceMath.id}`,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
        style: { strokeWidth: 2 },
      } as IEdge,
      {
        id: generateHash(),
        source: diceMath.id,
        target: histogram.id,
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
        style: { strokeWidth: 2 },
      } as IEdge,
    ];

    setNodes([dice, diceMath, integerValue, histogram]);
    setEdges(exampleEdges);
    resetHistory(workspace.activeDiagramId, { nodes: [dice, diceMath, integerValue, histogram], edges: exampleEdges });
    markExampleSeeded();
  }, [pendingExampleSeed, workspace, flow, markExampleSeeded, resetHistory, setNodes, setEdges]);

  React.useEffect(() => {
    const diagram = workspace.diagrams[activeId];
    if (!diagram) return;
    if (hydratedDiagramIdRef.current === activeId) return;
    hydratedDiagramIdRef.current = activeId;

    hydratingRef.current = true;
    setNodes(diagram.nodes);
    setEdges(diagram.edges);
    resetHistory(activeId, { nodes: diagram.nodes, edges: diagram.edges });

    window.requestAnimationFrame(() => {
      flow.setViewport(diagram.viewport);
      clearSimulation();
      window.requestAnimationFrame(() => {
        hydratingRef.current = false;
      });
    });
  }, [activeId, workspace, flow, clearSimulation, resetHistory, setNodes, setEdges]);

  React.useEffect(() => {
    if (hydratingRef.current || loading) return;

    const timer = window.setTimeout(() => {
      if (hydratingRef.current || loading) return;
      updateActiveContent({ nodes, edges }, flow.getViewport());
    }, 500);

    return () => window.clearTimeout(timer);
  }, [nodes, edges, activeId, loading, flow, updateActiveContent]);

  React.useEffect(() => {
    if (hydratingRef.current || restoringRef.current) return;

    const timer = window.setTimeout(() => {
      if (hydratingRef.current || restoringRef.current) return;

      const entry = getHistoryEntry(activeId);
      const snapshot = snapshotContent({ nodes, edges });
      const signature = contentSignature(snapshot);
      if (signature === entry.signature) return;

      entry.history.push(entry.content);
      entry.content = snapshot;
      entry.signature = signature;
    }, HISTORY_DEBOUNCE);

    return () => window.clearTimeout(timer);
  }, [nodes, edges, activeId, getHistoryEntry]);

  const applyHistoryContent = React.useCallback(
    (content: IDiagramContent) => {
      const snapshot = snapshotContent(content);
      const entry = getHistoryEntry(activeId);
      entry.content = snapshot;
      entry.signature = contentSignature(snapshot);

      restoringRef.current = true;
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);

      window.requestAnimationFrame(() => {
        restoringRef.current = false;
      });
    },
    [activeId, getHistoryEntry, setNodes, setEdges]
  );

  const commitPendingContent = React.useCallback((entry: IHistoryEntry, current: IDiagramContent): IDiagramContent => {
    const signature = contentSignature(current);
    if (signature !== entry.signature) {
      entry.history.push(entry.content);
      entry.content = current;
      entry.signature = signature;
    }
    return entry.content;
  }, []);

  const undo = React.useCallback(() => {
    const entry = getHistoryEntry(activeId);
    const current = commitPendingContent(entry, snapshotContent({ nodes, edges }));
    const previous = entry.history.undo(current);
    if (!previous) return;

    applyHistoryContent(previous);
  }, [activeId, nodes, edges, getHistoryEntry, commitPendingContent, applyHistoryContent]);

  const redo = React.useCallback(() => {
    const entry = getHistoryEntry(activeId);
    const current = snapshotContent({ nodes, edges });
    if (contentSignature(current) !== entry.signature) {
      commitPendingContent(entry, current);
      return;
    }

    const next = entry.history.redo(entry.content);
    if (!next) return;

    applyHistoryContent(next);
  }, [activeId, nodes, edges, getHistoryEntry, commitPendingContent, applyHistoryContent]);

  const copySelection = React.useCallback((): boolean => {
    const payload = createClipboardPayload(nodes, edges);
    if (!payload) return false;

    setWorkspaceClipboard(payload);
    void writeClipboardToSystem(payload);
    return true;
  }, [nodes, edges]);

  const pasteSelection = React.useCallback(async (): Promise<void> => {
    const payload = getWorkspaceClipboard() ?? (await readClipboardFromSystem());
    if (!payload) return;

    const pasteState = pasteStateRef.current;
    if (pasteState.payload !== payload) {
      pasteState.payload = payload;
      pasteState.count = 0;
    }
    pasteState.count += 1;

    const offset = { x: CLIPBOARD_OFFSET * pasteState.count, y: CLIPBOARD_OFFSET * pasteState.count };
    const { nodes: pastedNodes, edges: pastedEdges } = materializeClipboard(payload, { offset });

    setNodes((current) => [...current.map((node) => (node.selected ? { ...node, selected: false } : node)), ...pastedNodes]);
    setEdges((current) => [...current, ...pastedEdges]);
  }, [setNodes, setEdges]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      if (isUndoShortcut(event)) {
        event.preventDefault();
        undo();
        return;
      }

      if (isRedoShortcut(event)) {
        event.preventDefault();
        redo();
        return;
      }

      if (isCopyShortcut(event)) {
        if (copySelection()) event.preventDefault();
        return;
      }

      if (isPasteShortcut(event)) {
        event.preventDefault();
        void pasteSelection();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, copySelection, pasteSelection]);

  const onConnect = React.useCallback(
    (params: Connection) => {
      const targetAlreadyConnected = edges.some((edge) => edge.target === params.target && edge.targetHandle === params.targetHandle);
      if (targetAlreadyConnected) return;

      const existingEdges = edges.filter((edge) => edge.target === params.target && edge.targetHandle === params.targetHandle);
      if (existingEdges.length === 0) {
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#00a63e" },
              style: { strokeWidth: 2 },
            },
            eds
          )
        );
      }
    },
    [edges, setEdges]
  );

  const handleMoveEnd = React.useCallback(
    (_event: unknown, viewport: { x: number; y: number; zoom: number }) => {
      updateViewport({ x: viewport.x, y: viewport.y, zoom: viewport.zoom });
    },
    [updateViewport]
  );

  return (
    <main className="absolute left-48 top-[100px] right-0 bottom-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onMoveEnd={handleMoveEnd}
        nodeTypes={NodeManager.getNodeTypes()}
        deleteKeyCode={["Backspace", "Delete"]}
        selectionKeyCode="Shift"
        multiSelectionKeyCode={["Shift", "Control", "Meta"]}
        className="react-flow-board"
        fitView={false}>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};
