// components/SSEListener.client.jsx
"use client";

import { useEffect } from "react";

export default function SSEListener({ onEvent }) {
    useEffect(() => {
        const es = new EventSource("/api/events");
        es.onmessage = (e) => {
            try {
                onEvent(JSON.parse(e.data));
            } catch {
                onEvent(e.data);
            }
        };
        es.onerror = () => {
            console.error("SSE error");
            es.close();
        };
        return () => es.close();
    }, [onEvent]);

    return null;
}
