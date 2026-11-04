export const DEFAULT_HISTORY_LIMIT = 20;

export type IHistory<T> = {
  push: (state: T) => void;
  undo: (current: T) => T | null;
  redo: (current: T) => T | null;
  reset: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  size: () => number;
};

export function createHistory<T>(limit = DEFAULT_HISTORY_LIMIT): IHistory<T> {
  const past: T[] = [];
  const future: T[] = [];

  function trim(states: T[]): void {
    if (states.length > limit) states.splice(0, states.length - limit);
  }

  return {
    push(state: T): void {
      past.push(state);
      trim(past);
      future.length = 0;
    },

    undo(current: T): T | null {
      const previous = past.pop();
      if (previous === undefined) return null;

      future.push(current);
      trim(future);
      return previous;
    },

    redo(current: T): T | null {
      const next = future.pop();
      if (next === undefined) return null;

      past.push(current);
      trim(past);
      return next;
    },

    reset(): void {
      past.length = 0;
      future.length = 0;
    },

    canUndo: (): boolean => past.length > 0,
    canRedo: (): boolean => future.length > 0,
    size: (): number => past.length,
  };
}
