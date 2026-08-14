import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import {
  PINNED_MCP_PROTOCOL_VERSION,
  type RawHttpCapture,
} from "../frozen/phase2.1/src/officialMcp.ts";
import { isValidAdopterMetaKey } from "../frozen/phase2.1/src/mcp.ts";

export const ALGOLIA_REAL_SOURCE_META_KEY = "org.example.phase3/algolia-real-source-evidence";

if (!isValidAdopterMetaKey(ALGOLIA_REAL_SOURCE_META_KEY)) {
  throw new Error("Phase 3 experimental MCP metadata key is invalid.");
}

export interface Phase3McpRoundTrip {
  protocolEra: "modern";
  negotiatedProtocolVersion: "2026-07-28";
  publicResult: Awaited<ReturnType<Client["callTool"]>>;
  rawHttp: RawHttpCapture[];
}

/** Same official 2.0.0 injected-fetch lifecycle and pinned revision as the frozen checkpoint. */
export async function runOfficialAlgoliaMcpRoundTrip(
  metadata?: unknown,
): Promise<Phase3McpRoundTrip> {
  const handler = createMcpHandler(() => {
    const server = new McpServer({ name: "phase-3-algolia-real-source-server", version: "0.3.0" });
    server.registerTool(
      "lookup-zero",
      { description: "Return the already-captured real Algolia empty result." },
      async () => ({
        content: [{ type: "text" as const, text: "0 source matches returned" }],
        structuredContent: { items: [] },
        ...(metadata === undefined ? {} : { _meta: { [ALGOLIA_REAL_SOURCE_META_KEY]: metadata } }),
      }),
    );
    return server;
  }, { legacy: "reject", responseMode: "auto" });

  const rawHttp: RawHttpCapture[] = [];
  const injectedFetch: typeof fetch = async (requestInput, init) => {
    const request = new Request(requestInput, init);
    const requestClone = request.clone();
    const response = await handler.fetch(request);
    const responseClone = response.clone();
    rawHttp.push({
      request: {
        method: requestClone.method,
        url: requestClone.url,
        headers: Object.fromEntries(requestClone.headers.entries()),
        body: await requestClone.text(),
      },
      response: {
        status: responseClone.status,
        headers: Object.fromEntries(responseClone.headers.entries()),
        contentType: responseClone.headers.get("content-type") ?? "",
        body: await responseClone.text(),
      },
    });
    return response;
  };

  const client = new Client(
    { name: "phase-3-algolia-real-source-client", version: "0.3.0" },
    { versionNegotiation: { mode: { pin: PINNED_MCP_PROTOCOL_VERSION } } },
  );
  try {
    const transport = new StreamableHTTPClientTransport(
      new URL("https://phase3.example.invalid/mcp"),
      { fetch: injectedFetch },
    );
    await client.connect(transport);
    const protocolEra = client.getProtocolEra();
    const negotiatedProtocolVersion = client.getNegotiatedProtocolVersion();
    if (protocolEra !== "modern" || negotiatedProtocolVersion !== PINNED_MCP_PROTOCOL_VERSION) {
      throw new Error("Official MCP negotiation departed from the frozen path.");
    }
    const publicResult = await client.callTool({ name: "lookup-zero", arguments: {} });
    return { protocolEra, negotiatedProtocolVersion, publicResult, rawHttp };
  } finally {
    await client.close();
    await handler.close();
  }
}
