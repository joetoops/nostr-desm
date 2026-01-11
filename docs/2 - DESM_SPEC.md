# DESM SPEC: Deterministic Event-Driven State Machine

## Overview

The DESM primitive enables deterministic state reconstruction from unordered signed event streams. Given any set of signed events, DESM guarantees that all clients produce identical final state through canonical ordering and pure reduction.

---

## 1. Core Invariants

### 1.1 The Problem

Event-sourced systems often treat events as an unordered collection. While this preserves append-only semantics, it creates challenges for stateful operations where entities have relationships and changing states over time.

### 1.2 The Solution: DESM

DESM solves this through three guarantees:

1. **Canonical Ordering**: Deterministic sort (timestamp → id → insertion order) ensures identical event sequences across all runtimes.
2. **Signature Verification**: Every event must pass cryptographic signature verification before inclusion—no permissive defaults.
3. **Pure Reduction**: State is derived by folding ordered events; no side effects or external dependencies.

---

## 2. Technical Specification

### 2.1 Event Structure

Events are protocol-agnostic but cryptographically signed:

```typescript
interface DesmEvent {
  id: string;           // Unique identifier
  pubkey: string;       // Author's public key
  created_at: number;   // Unix timestamp
  kind?: number;        // Event type (optional, for filtering)
  content: string;      // JSON payload
  sig?: string;         // Cryptographic signature
  tags?: string[][];    // Metadata (e.g., references to other events)
}
```

### 2.2 Canonical Sort

Order is determined by:
1. `created_at` ascending (numeric, missing = 0)
2. `id` ascending (lexicographic, missing = '')
3. Original insertion index ascending (tie-breaker)

This ensures identical ordering regardless of JavaScript runtime sort stability.

### 2.3 Root vs Update Events

- **Root events**: No `"e"` reference tag. Establishes initial state.
- **Update events**: Contains `["e", "<root-id>"]` tag. Patches existing state.

### 2.4 State Reduction

State is computed by folding events in canonical order:

```typescript
function foldState(events: DesmEvent[]): Record<string, any> {
  return events.reduce((state, event) => {
    return { ...state, ...JSON.parse(event.content) };
  }, {});
}
```

Last-write-wins semantics. Invalid JSON is ignored.

---

## 3. Validation Properties

The included profile-state example validates:

| Property | Test |
|----------|------|
| **Determinism** | Shuffled input produces identical output |
| **Auth Gating** | Failed signature verification excludes event |
| **Tie-Breaking** | Same timestamp resolves by id lexicographically |
