import { deepClone } from "../../utils/deep-clone.ts";
import { DEFAULT_VIEWPORT } from "./naming.ts";
import type { IDiagram, IDiagramContent, IDiagramViewport, IWorkspace } from "./types.ts";

export type WorkspaceAction =
  | { type: "createDiagram"; id: string; name: string; now: string; viewport?: IDiagramViewport }
  | { type: "duplicateDiagram"; id: string; sourceId: string; name: string; now: string }
  | { type: "renameDiagram"; id: string; name: string; now: string }
  | { type: "closeDiagram"; id: string; replacementId: string; replacementName: string; now: string }
  | { type: "setActiveDiagram"; id: string }
  | { type: "updateDiagram"; id: string; content: IDiagramContent; viewport?: IDiagramViewport; now: string }
  | { type: "addDiagram"; diagram: IDiagram }
  | { type: "replaceWorkspace"; workspace: IWorkspace };

export function createEmptyDiagram(options: {
  id: string;
  name: string;
  now: string;
  viewport?: IDiagramViewport;
}): IDiagram {
  return {
    id: options.id,
    name: options.name,
    createdAt: options.now,
    updatedAt: options.now,
    revision: 0,
    viewport: options.viewport ?? { ...DEFAULT_VIEWPORT },
    nodes: [],
    edges: [],
  };
}

export function createInitialWorkspace(options: { id: string; name: string; now: string }): IWorkspace {
  const diagram = createEmptyDiagram(options);

  return {
    schemaVersion: 1,
    activeDiagramId: diagram.id,
    diagrams: { [diagram.id]: diagram },
  };
}

export function getDiagramNames(workspace: IWorkspace): string[] {
  return Object.values(workspace.diagrams).map((diagram) => diagram.name);
}

export function workspaceReducer(state: IWorkspace, action: WorkspaceAction): IWorkspace {
  switch (action.type) {
    case "createDiagram": {
      const diagram = createEmptyDiagram(action);
      return {
        ...state,
        activeDiagramId: diagram.id,
        diagrams: { ...state.diagrams, [diagram.id]: diagram },
      };
    }

    case "duplicateDiagram": {
      const source = state.diagrams[action.sourceId];
      if (!source) return state;

      const copy = deepClone(source);
      copy.id = action.id;
      copy.name = action.name;
      copy.createdAt = action.now;
      copy.updatedAt = action.now;
      copy.revision = 0;

      return {
        ...state,
        activeDiagramId: copy.id,
        diagrams: { ...state.diagrams, [copy.id]: copy },
      };
    }

    case "renameDiagram": {
      const diagram = state.diagrams[action.id];
      if (!diagram) return state;

      return {
        ...state,
        diagrams: {
          ...state.diagrams,
          [action.id]: { ...diagram, name: action.name, updatedAt: action.now, revision: diagram.revision + 1 },
        },
      };
    }

    case "closeDiagram": {
      if (!state.diagrams[action.id]) return state;

      const diagramIds = Object.keys(state.diagrams);
      const diagrams = { ...state.diagrams };
      delete diagrams[action.id];

      if (diagramIds.length === 1) {
        const replacement = createEmptyDiagram({ id: action.replacementId, name: action.replacementName, now: action.now });
        return {
          ...state,
          activeDiagramId: replacement.id,
          diagrams: { [replacement.id]: replacement },
        };
      }

      let activeDiagramId = state.activeDiagramId;
      if (activeDiagramId === action.id) {
        const closedIndex = diagramIds.indexOf(action.id);
        activeDiagramId = diagramIds[closedIndex + 1] ?? diagramIds[closedIndex - 1];
      }

      return { ...state, activeDiagramId, diagrams };
    }

    case "setActiveDiagram": {
      if (!state.diagrams[action.id]) return state;
      return { ...state, activeDiagramId: action.id };
    }

    case "updateDiagram": {
      const diagram = state.diagrams[action.id];
      if (!diagram) return state;

      return {
        ...state,
        diagrams: {
          ...state.diagrams,
          [action.id]: {
            ...diagram,
            nodes: action.content.nodes,
            edges: action.content.edges,
            viewport: action.viewport ?? diagram.viewport,
            updatedAt: action.now,
            revision: diagram.revision + 1,
          },
        },
      };
    }

    case "addDiagram": {
      return {
        ...state,
        activeDiagramId: action.diagram.id,
        diagrams: { ...state.diagrams, [action.diagram.id]: action.diagram },
      };
    }

    case "replaceWorkspace":
      return action.workspace;
  }
}
