// app/api/events/route.ts
import { NextRequest } from "next/server";

let clients: ReadableStreamDefaultController<Uint8Array>[] = [];

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            clients.push(controller);

            // Remove controller on client disconnect
            const onAbort = () => {
                controller.close();
                clients = clients.filter((c) => c !== controller);
            };
            request.signal.addEventListener("abort", onAbort);
        },
        // cancel hook is not reliable for removing controller
        // so we handle removal in the abort listener above
    });

    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}

export async function POST(request: NextRequest) {
    let payload: any;
    try {
        payload = await request.json();
    } catch {
        payload = { raw: await request.text() };
    }

    const data = `data: ${JSON.stringify(payload)}\n\n`;
    const encoder = new TextEncoder();

    // Broadcast to alive clients only
    clients = clients.filter((controller) => {
        try {
            controller.enqueue(encoder.encode(data));
            return true;
        } catch {
            // Controller is closed or errored, remove it
            return false;
        }
    });

    return new Response(
        JSON.stringify({ success: true, clients: clients.length, payload }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}
