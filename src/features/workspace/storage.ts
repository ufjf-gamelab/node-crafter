import { deserializeWorkspace, serializeWorkspace } from "./serialization.ts";
import type { IWorkspace } from "./types.ts";
import { createInitialWorkspace } from "./workspace-reducer.ts";

export const WORKSPACE_STORAGE_KEY = "node-crafter:workspace";
export const CORRUPT_WORKSPACE_STORAGE_KEY_PREFIX = "node-crafter:workspace:corrupt-";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export type LoadWorkspaceOptions = {
  initialName: string;
  createId: () => string;
  now: () => string;
};

export type LoadWorkspaceResult = {
  workspace: IWorkspace;
  loaded: boolean;
  error?: string;
};

export function loadWorkspace(storage: StorageLike, options: LoadWorkspaceOptions): LoadWorkspaceResult {
  const raw = storage.getItem(WORKSPACE_STORAGE_KEY);

  if (raw === null) {
    return { workspace: createInitialWorkspace({ id: options.createId(), name: options.initialName, now: options.now() }), loaded: false };
  }

  try {
    const workspace = deserializeWorkspace(JSON.parse(raw), { now: options.now() });
    return { workspace, loaded: true };
  } catch (error) {
    try {
      storage.setItem(`${CORRUPT_WORKSPACE_STORAGE_KEY_PREFIX}${Date.now()}`, raw);
    } catch {
      // Storage may be unavailable or full; the invalid workspace is kept in memory only.
    }

    return {
      workspace: createInitialWorkspace({ id: options.createId(), name: options.initialName, now: options.now() }),
      loaded: false,
      error: getErrorMessage(error),
    };
  }
}

export function saveWorkspace(storage: StorageLike, workspace: IWorkspace): void {
  storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(serializeWorkspace(workspace)));
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
