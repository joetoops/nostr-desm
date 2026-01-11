import { expect, test } from 'vitest';
import { reduce, type ReduceOptions } from '../src/index.js';
import { canonicalSort } from '../src/order.js';
import type { DesmEvent } from '../src/types.js';

const events: DesmEvent[] = [
  { id: 'root1', pubkey: 'p', created_at: 1, content: '{"name":"Alice"}', tags: [] },
  { id: 'u1', pubkey: 'p', created_at: 2, kind: 6, content: '{"bio":"Updated"}', tags: [['e','root1']] },
];

const mockVerifySig = (_: DesmEvent): boolean => true;
const failVerifySig = (_: DesmEvent): boolean => false;

const opts: ReduceOptions = { verifySig: mockVerifySig, updateKind: 6 };

test('determinism', () => {
  const shuffled = [...events].sort(() => Math.random() - 0.5);
  expect(reduce(events, opts)).toEqual(reduce(shuffled, opts));
});

test('auth fail', () => {
  expect(reduce(events, { ...opts, verifySig: failVerifySig })).toEqual({});
});

test('tie-break', () => {
  const tie: DesmEvent[] = [
    { id: 'b', pubkey: 'p', created_at: 10, content: '{}', tags: [] },
    { id: 'a', pubkey: 'p', created_at: 10, content: '{}', tags: [] },
  ];
  const sortedIds = canonicalSort(tie).map(e => e.id);
  expect(sortedIds).toEqual(['a', 'b']);
});
