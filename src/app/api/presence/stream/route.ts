import { clientIp, hashIp } from "@/lib/api/ip";
import {
  leaveVisitor,
  touchVisitor,
  visitorCount,
} from "@/lib/presence/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent") ?? "ua";
  const id = hashIp(`${ip}:${ua.slice(0, 40)}`);

  touchVisitor(id);

  const encoder = new TextEncoder();
  let closed = false;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      send("presence", { count: visitorCount() });

      heartbeat = setInterval(() => {
        touchVisitor(id);
        send("presence", { count: visitorCount() });
      }, 8_000);

      request.signal.addEventListener("abort", () => {
        closed = true;
        if (heartbeat) clearInterval(heartbeat);
        leaveVisitor(id);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
    cancel() {
      closed = true;
      if (heartbeat) clearInterval(heartbeat);
      leaveVisitor(id);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
