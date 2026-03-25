import { BASE_SYSTEM_PROMPT } from "./baseSystemPrompt";
import { RESPONSE_FORMATTING_GUIDE } from "./responseFormattingGuide";
import { CURRENT_KNOWLEDGE_PACK } from "../knowledge/currentKnowledgePack";
import { ARCHIVE_KNOWLEDGE_PACK } from "../knowledge/archiveKnowledgePack";
import { CALCULATOR_INPUT_SCHEMA } from "../calculators/inputSchema";
import { CALCULATION_RULES_REGISTRY } from "../calculators/rulesRegistry";
import { detectCalculationIntent } from "../calculators/engine";

export function buildSystemPrompt(messages = []) {
  const lastUserText =
    [...messages].reverse().find((message) => message?.role === "user")?.content || "";

  const historical = isHistoricalQuestion(lastUserText);
  const calculationIntent = detectCalculationIntent(messages);

  const sections = [
    BASE_SYSTEM_PROMPT,
    RESPONSE_FORMATTING_GUIDE,
    CURRENT_KNOWLEDGE_PACK,
  ];

  if (historical) {
    sections.push(ARCHIVE_KNOWLEDGE_PACK);
  }

  if (calculationIntent) {
    sections.push(buildCalculationContext());
  }

  return sections.filter(Boolean).join("\n\n");
}

function isHistoricalQuestion(text = "") {
  const normalized = text.toLowerCase();
  const historicalMarkers = [
    "2019",
    "2014",
    "2009",
    "2004",
    "2001",
    "older policy",
    "previous policy",
    "historical",
    "legacy",
    "compare with old",
    "compare with previous",
    "पुरानी नीति",
    "पुराना",
    "तुलना",
    "पहले की नीति",
  ];

  return historicalMarkers.some((marker) => normalized.includes(marker));
}

function buildCalculationContext() {
  return `
CALCULATION CONTEXT

Calculator input schema:
${JSON.stringify(CALCULATOR_INPUT_SCHEMA, null, 2)}

Calculation rule registry:
${JSON.stringify(CALCULATION_RULES_REGISTRY, null, 2)}

Calculation behavior rules:
- If the user asks for a subsidy or incentive estimate, first check whether the required project facts are present.
- If required facts are missing, ask only for the missing items needed for a basic screening.
- Do not invent numeric rates, caps, or formulas for any rule family that is marked pending_extraction.
- Until deterministic rules are fully encoded, you may identify likely applicable incentive heads and required documents/inputs, but numeric outputs must be labelled as unavailable unless computed outside the LLM.
`;
}
