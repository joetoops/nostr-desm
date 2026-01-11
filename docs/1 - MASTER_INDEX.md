# MASTER_INDEX.md: Documentation Index for nostr-desm

## Scope

This repository validates deterministic state reconstruction from signed event streams via canonical ordering and pure reduction.

## Document Structure

1. **DESM_SPEC.md**: Conceptual specification of the DESM primitive.
2. **NOSTR_CONTEXT.md**: Protocol background relevant to understanding the problem space.

## Decision Ledger (Primitive-Lane Only)

| Decision | Status | Rationale |
|----------|--------|-----------|
| DESM = Deterministic Event-Driven State Machine | Settled | Canonical terminology for the primitive. |
| Signature verification required (inject, throws if missing) | Settled | Authorship must be real; no permissive defaults. |
| Explicit stable canonical sort (time/id/index) | Settled | Determinism must be runtime-independent. |
| Profile-state proof first | Settled | Undeniable, low-surface; validates core properties. |
| Kind 6 / NIP-100 tentative only | Settled | Avoid protocol lock-in; drafts are exploratory. |
