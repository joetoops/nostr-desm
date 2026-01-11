import type { DesmEvent } from './types.js';
import { canonicalSort } from './order.js';

/**
 * Options for DESM reduce/replay.
 */
export interface ReduceOptions {
  /**
   * Required signature verifier. Throws if not provided.
   * Tests: stub/mock. Production: inject real Nostr verifier.
   */
  verifySig: (event: DesmEvent) => boolean;
  /**
   * Draft update event kind (TBD). Undefined = no filtering.
   */
  updateKind?: number;
}

/**
 * Filter root events (no "e" ref tag) and updates (tags[0][0] === 'e').
 */
function isRoot(event: DesmEvent): boolean {
  return !event.tags?.some(tag => tag[0] === 'e');
}

function isUpdate(event: DesmEvent, opts: ReduceOptions): boolean {
  if (opts.updateKind !== undefined && event.kind !== opts.updateKind) return false;
  return event.tags?.some(tag => tag[0] === 'e') ?? false;
}

/**
 * Reduce sorted events to current state (profile example: JSON content merge, last wins).
 * Assumes content JSON {name?: string, bio?: string}.
 */
function foldState(events: DesmEvent[]): Record<string, any> {
  return events.reduce((state, event) => {
    try {
      return { ...state, ...JSON.parse(event.content) };
    } catch {
      // Invalid JSON: ignore
      return state;
    }
  }, {} as Record<string, any>);
}

/**
 * DESM reduce: canonical replay to current state.
 */
export function reduce(events: DesmEvent[], opts: ReduceOptions): Record<string, any> {
  if (!opts.verifySig) {
    throw new Error('verifySig not provided — inject verifier (tests stub).');
  }

  const sorted = canonicalSort(events);
  const valid = sorted.filter(event => opts.verifySig(event));

  const roots = valid.filter(e => isRoot(e));
  const updates = valid.filter(e => isUpdate(e, opts));

  // Simple profile: all roots/updates fold (ref validation future)
  return foldState([...roots, ...updates]);
}

/**
 * Replay: sort + reduce (full deterministic reconstruction).
 */
export function replay(events: DesmEvent[], opts: ReduceOptions): Record<string, any> {
  return reduce(events, opts);
}
