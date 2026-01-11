import type { DesmEvent } from './types.js';

/**
 * Canonical sort for DESM replay: deterministic order independent of runtime sort stability.
 * 
 * Order: created_at ASC (num, missing=0), id lex ASC (str, missing=''), originalIndex ASC.
 * 
 * Used in reduce/replay/tests/examples for determinism.
 */
export function canonicalSort(events: DesmEvent[]): DesmEvent[] {
  return events
    .map((event, idx) => ({ event, idx }))
    .sort((a, b) => {
      const aTime = Number(a.event.created_at) || 0;
      const bTime = Number(b.event.created_at) || 0;
      if (aTime !== bTime) return aTime - bTime;

      const aId = String(a.event.id || '');
      const bId = String(b.event.id || '');
      if (aId !== bId) return aId.localeCompare(bId);

      return a.idx - b.idx;
    })
    .map(({ event }) => event);
}
