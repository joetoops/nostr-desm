/**
 * Neutral event type for DESM primitive.
 * Nostr-compatible but protocol-agnostic.
 * Missing fields normalized in canonicalSort/reduce.
 */
export interface DesmEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind?: number; // Draft update kind (TBD)
  content: string;
  sig?: string;
  tags?: string[][];
}
