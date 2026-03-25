import { BASE_SYSTEM_PROMPT } from "./prompt/baseSystemPrompt";
import { RESPONSE_FORMATTING_GUIDE } from "./prompt/responseFormattingGuide";
import { CURRENT_KNOWLEDGE_PACK } from "./knowledge/currentKnowledgePack";

export const SYSTEM_PROMPT = [
  BASE_SYSTEM_PROMPT,
  RESPONSE_FORMATTING_GUIDE,
  CURRENT_KNOWLEDGE_PACK
].join("\n\n");
