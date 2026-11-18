import { createOpenAI } from "@ai-sdk/openai";

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
export const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
export const DEVELOPMENT_PLAN_MODEL = "openai/gpt-6-astra";

/** Resends a gateway-issued run id on follow-up calls; never mints one. */
function createRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  return {
    getRunId: () => runId,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      const response = await fetch(input, { ...init, headers });
      runId ??= response.headers.get(RUN_ID_HEADER)?.trim() || undefined;
      return response;
    },
  };
}

/** Create the provider per request. */
export function createGatewayResponsesProvider(apiKey: string) {
  const runIdFetch = createRunIdFetch();
  return createOpenAI({
    baseURL: AI_GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
}

/** Map gateway failures to a safe, user-facing message. */
export function gatewayErrorMessage(error: unknown): string {
  const seen = new Set<unknown>();
  let e: unknown = error;
  while (e && typeof e === "object" && !seen.has(e)) {
    seen.add(e);
    const status = (e as { statusCode?: number }).statusCode;
    if (status === 402) return "Kredit AI workspace habis. Tambahkan kredit untuk membuat rencana baru.";
    if (status === 429) return "Terlalu banyak permintaan AI saat ini. Coba lagi beberapa saat lagi.";
    if (status === 403) return "Akses AI untuk workspace ini sedang dibatasi. Hubungi admin workspace.";
    if (status === 401) return "Konfigurasi AI belum lengkap.";
    if (typeof status === "number" && status >= 500) return "Layanan AI sedang gangguan. Coba lagi nanti.";
    e = (e as { cause?: unknown }).cause;
  }
  return "Rencana belum berhasil dibuat. Coba lagi.";
}
