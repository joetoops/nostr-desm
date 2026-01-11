# NOSTR CONTEXT: Protocol Background

## Overview

This document provides background on the Nostr protocol relevant to understanding the DESM primitive. It is informational context, not a specification.

---

## 1. Protocol Fundamentals

### 1.1 Architecture

- **Events**: Cryptographically signed JSON objects with `id`, `pubkey`, `created_at`, `kind`, `content`, `tags`, and `sig` fields.
- **Relays**: WebSocket servers that store and forward events. They verify signatures but do not interpret content.
- **Clients**: User interfaces that manage keys and construct/display events.
- **Identity**: Public/private key pairs. Identity is portable across relays and clients.

### 1.2 Key Properties

- **Append-only**: Events are immutable once signed. Updates require new events that reference previous ones.
- **Decentralized**: No single relay is authoritative. Users choose which relays to publish to and read from.
- **Censorship-resistant**: Users can switch relays if one misbehaves. Keys (identity) move with the user.

### 1.3 Limitations Relevant to DESM

- **Unordered delivery**: Events may arrive from relays in any order.
- **No guaranteed persistence**: Relays may prune old events.
- **No built-in state**: Events are individual facts, not stateful objects.

DESM addresses the ordering and state reconstruction challenges while remaining agnostic to relay behavior and persistence.

---

## 2. Relevant NIPs

NIPs (Nostr Implementation Possibilities) are community standards:

| NIP | Description | Relevance |
|-----|-------------|-----------|
| NIP-01 | Basic protocol definition | Event structure used by DESM |
| NIP-10 | Text note replies and mentions | Tag conventions for references |

This primitive does not depend on or propose any specific NIPs. Kind numbers and tag conventions in the implementation are for demonstration only.

---

## 3. Why This Matters

The Nostr event model is elegant for censorship-resistant messaging but lacks native support for stateful applications. DESM demonstrates that deterministic state can be layered on top of signed events without protocol changes—purely through client-side logic.
