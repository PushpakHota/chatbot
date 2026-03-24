import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../../../lib/systemPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY environment variable.");
  }

  return new Anthropic({ apiKey });
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => {
      return (
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      );
    })
    .slice(-20)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

function extractReply(response) {
  if (!response?.content || !Array.isArray(response.content)) return "";

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n\n")
    .trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = normalizeMessages(body?.messages);

    if (!messages.length) {
      return Response.json(
        { error: "A non-empty messages array is required." },
        { status: 400 }
      );
    }

    const client = buildClient();
    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

    const response = await client.messages.create({
      model,
      max_tokens: 1400,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = extractReply(response);

    return Response.json({
      reply: reply || "No reply was generated.",
      model,
      requestId: response?._request_id || null,
    });
  } catch (error) {
    console.error("/api/chat error", error);

    return Response.json(
      {
        error:
          error?.message ||
          "The server could not process the chat request.",
      },
      { status: 500 }
    );
  }
}
