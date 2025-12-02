// POST then open EventSource is awkward because SSE is GET-only normally.
// We'll implement a small client approach: use fetch() to POST, create a ReadableStream
// However, simpler: use fetch streaming:

async function streamExplain(payload, onChunk) {
  const res = await fetch("/api/mentor/explain/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include"
  });

  if (!res.ok) throw new Error("Stream failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  while (!done) {
    const { value, done: d } = await reader.read();
    done = d;
    if (value) {
      const chunk = decoder.decode(value);
      // backend encodes each SSE chunk as "data: <chunk>\n\n"
      // strip SSE wrapper if present:
      const text = chunk.replace(/^data:\s*/, "").replace(/\n\n$/, "");
      onChunk(text);
    }
  }
}

export default streamExplain;