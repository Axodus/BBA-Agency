export type AssetStatus = "PROPOSED" | "PRODUCED" | "UNDER_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED" | "SUPERSEDED" | "REJECTED";
export const TERMINAL_ASSET_STATUSES: readonly AssetStatus[] = ["ARCHIVED", "SUPERSEDED"];
