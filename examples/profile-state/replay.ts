#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { reduce } from '../../src/index.js';
import { canonicalSort } from '../../src/order.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mockVerifySig = (_event: any): boolean => true;

const opts = {
  verifySig: mockVerifySig,
  updateKind: 6,
};

async function main() {
  const data = await readFile(path.join(__dirname, 'events.json'), 'utf8');
  const events = JSON.parse(data) as any[];
  
  const sorted = canonicalSort(events);
  console.log('Sorted IDs:', sorted.map(e => e.id));
  
  const state = reduce(events, opts);
  console.log('Final state:', state);
}

main().catch(console.error);
