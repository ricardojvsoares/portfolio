/** In-memory visitor presence for SSE demos (per server instance). */

type Visitor = { lastSeen: number };

const visitors = new Map<string, Visitor>();
const STALE_MS = 45_000;

export function touchVisitor(id: string) {
  visitors.set(id, { lastSeen: Date.now() });
  prune();
}

export function leaveVisitor(id: string) {
  visitors.delete(id);
}

export function visitorCount() {
  prune();
  return visitors.size;
}

function prune() {
  const now = Date.now();
  for (const [id, visitor] of visitors) {
    if (now - visitor.lastSeen > STALE_MS) visitors.delete(id);
  }
}
