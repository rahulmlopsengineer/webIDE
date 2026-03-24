/**
 * lib/providers/index.ts — Groq (Llama 3.3 70B)
 * Install: npm install groq-sdk
 * Free key: https://console.groq.com
 */

import Groq from "groq-sdk";

export interface StreamChunk    { text: string }
export interface GenerateOptions {
  system:     string;
  user:       string;
  maxTokens?: number;
}

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function* streamAI(opts: GenerateOptions): AsyncGenerator<StreamChunk> {
  const stream = await client.chat.completions.create({
    model:      "llama-3.3-70b-versatile",   // updated — 3.1 was decommissioned
    max_tokens: opts.maxTokens ?? 8000,
    stream:     true,
    messages: [
      { role: "system", content: opts.system },
      { role: "user",   content: opts.user   },
    ],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? "";
    if (text) yield { text };
  }
}