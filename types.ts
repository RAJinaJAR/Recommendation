
export type Industry = "Oil & Gas" | "Power & Utilities" | "Metals" | "Agri-Commodities" | "Financial Services" | "Multi-Commodity";
export type TradingType = "Physical" | "Financial" | "Both";
export type OrgSize = "Small/Startup" | "Medium" | "Enterprise";
export type CurrentSystem = "Manual/Spreadsheets" | "In-house Tool" | "Other CTRM System" | "None";
export type Priority = "Trading" | "Risk" | "Logistics" | "Settlements" | "Regulatory Compliance" | "Accounting" | "Forecasting" | "ETRM Integration";
export type Region = "North America" | "Europe" | "APAC" | "MENA" | "South America" | "Global";
export type Integration = "ERP" | "Risk Engines" | "Market Data Feeds" | "None" | "Other";

export interface UserAnswers {
  industry: Industry | null;
  users: number;
  tradingType: TradingType | null;
  orgSize: OrgSize | null;
  currentSystem: CurrentSystem | null;
  priorities: Priority[];
  region: Region | null;
  integrations: Integration[];
}

export type QuestionType = 'select' | 'multiselect' | 'number' | 'dropdown';

export interface Question {
  id: keyof UserAnswers;
  text: string;
  type: QuestionType;
  options?: string[];
  icon: React.ReactNode;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  keyStrengths: string[];
}
