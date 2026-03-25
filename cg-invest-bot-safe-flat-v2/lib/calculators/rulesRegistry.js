export const CALCULATION_RULES_REGISTRY = {
  version: "skeleton-v1",
  mode: "deterministic-rules-planned",
  status: "pending_official_rule_extraction",
  warning:
    "Numeric subsidy formulas are NOT fully encoded yet. Do not invent rates, caps, or durations from this registry. Use it as a scaffold only.",
  sourceDocuments: [
    "CG Fixed Capital Reimbursement Subsidy Rule 2024",
    "Interest Subsidy-2024",
    "Net SGST Grant Rule",
    "EPF Reimbursement Rule-2024",
    "Electricity_Examption",
    "Margin Money Subsidy-2024",
    "Rojgaar Anudan Niyam-2024",
    "stamp duty notification-2024",
    "SME listing Subsidy-2024",
    "Export certificate reimbursement rule-2024",
    "CG Logistics Grant Notification",
    "Service Sector Grant Notification",
    "Tranport Subsidy-2024",
    "Combine Notification(Project cost,Quality certificate, technical patent & Technology purchase)",
    "Water and Energy Audit Expenses Reimbursement Rule-2024",
    "Policy Option-2024"
  ],
  ruleFamilies: {
    fixedCapitalSubsidy: {
      status: "pending_extraction",
      dependsOn: ["industryType", "sector", "fixedCapitalLakhs", "district", "block", "entrepreneurCategory"],
      notes: [
        "Likely depends on enterprise category, sector category, and block/district classification.",
        "Exact slabs, caps, and durations must be extracted from official rule PDF."
      ]
    },
    interestSubsidy: {
      status: "pending_extraction",
      dependsOn: ["loanAmountLakhs", "loanTenureYears", "annualInterestPercent", "sector", "industryType", "block"]
    },
    netSgst: {
      status: "pending_extraction",
      dependsOn: ["fixedCapitalLakhs", "industryType", "sector", "block"],
      notes: [
        "Policy option rules may require choosing between Net SGST reimbursement and another head."
      ]
    },
    epfReimbursement: {
      status: "pending_extraction",
      dependsOn: ["employmentCount", "industryType", "sector"]
    },
    electricity: {
      status: "pending_extraction",
      dependsOn: ["electricityUnitsPerMonthLakhs", "electricityTariffPerUnit", "electricityDutyPercent", "industryType", "sector", "block"]
    },
    marginMoney: {
      status: "pending_extraction",
      dependsOn: ["entrepreneurCategory", "loanAmountLakhs", "industryType", "sector"]
    },
    employmentAssistance: {
      status: "pending_extraction",
      dependsOn: ["employmentCount", "industryType", "sector"]
    },
    stampDuty: {
      status: "pending_extraction",
      dependsOn: ["industryType", "sector", "landPurchaseValueLakhs"]
    },
    transportOrLogistics: {
      status: "pending_extraction",
      dependsOn: ["isExporter", "yearlyFreightLakhs", "sector", "industryType"]
    },
    qualityPatentTechPurchase: {
      status: "pending_extraction",
      dependsOn: ["industryType", "sector"],
      notes: [
        "Source is the combined notification for project cost, quality certificate, technical patent, and technology purchase."
      ]
    }
  }
};
