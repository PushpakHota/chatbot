export const CALCULATOR_INPUT_SCHEMA = {
  version: "v1-public-portal-aligned",
  source: "Public Subsidy Calculator page on invest.cg.gov.in",
  requiredForBasicScreening: [
    "entrepreneurCategory",
    "industryType",
    "sector",
    "fixedCapitalLakhs",
    "district"
  ],
  fields: {
    entrepreneurCategory: {
      type: "string",
      description: "Entrepreneur category selected on the public calculator",
      examples: [
        "General Category Entrepreneurs",
        "Entrepreneurs from the Scheduled Castes and Scheduled Tribes",
        "Women Entrepreneurs",
        "Foreign Direct Investors (FDI)",
        "Export Investors"
      ]
    },
    industryType: {
      type: "string",
      enum: ["Manufacturing", "Service"]
    },
    sector: {
      type: "string",
      examples: [
        "Agriculture, Food & Horticulture",
        "Automobile",
        "Defence and Aerospace",
        "Electrical & Electronics",
        "Engineering",
        "IT Hardware",
        "Pharmaceutical and Medical Device",
        "Textile",
        "Toy Sector"
      ]
    },
    subsector: {
      type: "string",
      optional: true
    },
    plantAndMachineryLakhs: {
      type: "number",
      optional: true
    },
    fixedCapitalLakhs: {
      type: "number",
      description: "Fixed capital investment in lakhs"
    },
    district: {
      type: "string"
    },
    block: {
      type: "string",
      optional: true,
      description: "Needed where block group or area classification affects the incentive"
    },
    areaAcres: {
      type: "number",
      optional: true
    },
    ratePerAcreLakhs: {
      type: "number",
      optional: true
    },
    loanAmountLakhs: {
      type: "number",
      optional: true
    },
    loanTenureYears: {
      type: "number",
      optional: true
    },
    annualInterestPercent: {
      type: "number",
      optional: true
    },
    electricityUnitsPerMonthLakhs: {
      type: "number",
      optional: true
    },
    electricityTariffPerUnit: {
      type: "number",
      optional: true
    },
    electricityDutyPercent: {
      type: "number",
      optional: true
    },
    employmentCount: {
      type: "number",
      optional: true
    },
    mandiFeeYearlyLakhs: {
      type: "number",
      optional: true
    },
    isExporter: {
      type: "boolean",
      optional: true
    },
    yearlyFreightLakhs: {
      type: "number",
      optional: true
    }
  }
};
