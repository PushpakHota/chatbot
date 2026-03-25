import { CALCULATOR_INPUT_SCHEMA } from "./inputSchema";
import { CALCULATION_RULES_REGISTRY } from "./rulesRegistry";

export function normalizeProjectInput(raw = {}) {
  return {
    entrepreneurCategory: raw.entrepreneurCategory || null,
    industryType: raw.industryType || null,
    sector: raw.sector || null,
    subsector: raw.subsector || null,
    plantAndMachineryLakhs: normalizeNumber(raw.plantAndMachineryLakhs),
    fixedCapitalLakhs: normalizeNumber(raw.fixedCapitalLakhs),
    district: raw.district || null,
    block: raw.block || null,
    areaAcres: normalizeNumber(raw.areaAcres),
    ratePerAcreLakhs: normalizeNumber(raw.ratePerAcreLakhs),
    loanAmountLakhs: normalizeNumber(raw.loanAmountLakhs),
    loanTenureYears: normalizeNumber(raw.loanTenureYears),
    annualInterestPercent: normalizeNumber(raw.annualInterestPercent),
    electricityUnitsPerMonthLakhs: normalizeNumber(raw.electricityUnitsPerMonthLakhs),
    electricityTariffPerUnit: normalizeNumber(raw.electricityTariffPerUnit),
    electricityDutyPercent: normalizeNumber(raw.electricityDutyPercent),
    employmentCount: normalizeNumber(raw.employmentCount),
    mandiFeeYearlyLakhs: normalizeNumber(raw.mandiFeeYearlyLakhs),
    isExporter:
      typeof raw.isExporter === "boolean"
        ? raw.isExporter
        : typeof raw.isExporter === "string"
          ? ["yes", "true", "1"].includes(raw.isExporter.toLowerCase())
          : null,
    yearlyFreightLakhs: normalizeNumber(raw.yearlyFreightLakhs),
  };
}

export function detectCalculationIntent(messages = []) {
  const lastUserMessage = [...messages].reverse().find((m) => m?.role === "user");
  const text = (lastUserMessage?.content || "").toLowerCase();

  const keywords = [
    "subsidy",
    "estimate",
    "eligibility",
    "incentive",
    "calculator",
    "sgst",
    "interest subsidy",
    "stamp duty",
    "epf",
    "electricity",
    "transport subsidy",
    "margin money",
    "rojgaar",
    "employment assistance",
    "लाभ",
    "सब्सिडी",
    "अनुदान",
    "प्रोत्साहन",
    "कैलकुलेशन",
    "estimate",
    "project cost",
  ];

  return keywords.some((keyword) => text.includes(keyword));
}

export function getMissingBasicCalculationFields(projectInput) {
  const required = CALCULATOR_INPUT_SCHEMA.requiredForBasicScreening;
  return required.filter((field) => {
    const value = projectInput[field];
    return value === null || value === undefined || value === "";
  });
}

export function runDeterministicCalculation(projectInput) {
  return {
    status: "not_configured",
    message:
      "Deterministic incentive formulas are not fully encoded yet. Use this engine only after official rule extraction is completed.",
    registryVersion: CALCULATION_RULES_REGISTRY.version,
    projectInput,
    computedHeads: []
  };
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}
