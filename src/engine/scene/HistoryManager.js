export class HistoryManager {
  constructor(options = {}) {
    this.maxSnapshots = typeof options.maxSnapshots === 'number' && options.maxSnapshots > 0
      ? options.maxSnapshots
      : 60;
    this.undoStack = [];
    this.redoStack = [];
    this.listeners = new Set();
  }

  cloneState(state) {
    if (!state) return null;
    try {
      if (typeof structuredClone === 'function') {
        return structuredClone(state);
      }
    } catch {}
    try {
      return JSON.parse(JSON.stringify(state));
    } catch {
      return null;
    }
  }

  pushSnapshot(state) {
    if (!state) return false;
    const snap = this.cloneState(state);
    if (!snap) return false;

    this.undoStack.push(snap);
    if (this.undoStack.length > this.maxSnapshots) {
      this.undoStack.shift();
    }
    this.redoStack.length = 0;
    this.notify();
    return true;
  }

  undo(currentState) {
    if (this.undoStack.length === 0) return null;

    if (currentState) {
      const snapCurrent = this.cloneState(currentState);
      if (snapCurrent) {
        this.redoStack.push(snapCurrent);
      }
    }

    const previousState = this.undoStack.pop();
    this.notify();
    return previousState;
  }

  redo(currentState) {
    if (this.redoStack.length === 0) return null;

    if (currentState) {
      const snapCurrent = this.cloneState(currentState);
      if (snapCurrent) {
        this.undoStack.push(snapCurrent);
      }
    }

    const nextState = this.redoStack.pop();
    this.notify();
    return nextState;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  getUndoCount() {
    return this.undoStack.length;
  }

  getRedoCount() {
    return this.redoStack.length;
  }

  peekUndo() {
    if (this.undoStack.length === 0) return null;
    return this.cloneState(this.undoStack[this.undoStack.length - 1]);
  }

  peekRedo() {
    if (this.redoStack.length === 0) return null;
    return this.cloneState(this.redoStack[this.redoStack.length - 1]);
  }

  clear() {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.notify();
  }

  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    const stats = {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length
    };
    for (const listener of this.listeners) {
      try {
        listener(stats);
      } catch {}
    }
  }

  applySnapshotToTarget(target, snapshot) {
    if (!target || !snapshot || typeof target !== 'object' || typeof snapshot !== 'object') {
      return false;
    }
    const snap = this.cloneState(snapshot);
    if (!snap) return false;

    for (const key of Object.keys(target)) {
      delete target[key];
    }
    for (const key of Object.keys(snap)) {
      target[key] = snap[key];
    }
    return true;
  }
}

export const historyManager = new HistoryManager();
