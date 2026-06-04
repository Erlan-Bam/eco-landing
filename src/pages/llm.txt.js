import { buildLlmsText } from "./llms.txt.js";

export async function GET() {
  return new Response(buildLlmsText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
