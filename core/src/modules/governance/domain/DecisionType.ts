export const DecisionType = {
  DIRECTION: "DIRECTION",
  ACCEPTANCE: "ACCEPTANCE",
  INSTITUTIONAL_APPROVAL: "INSTITUTIONAL_APPROVAL",
  PUBLICATION: "PUBLICATION",
  EXCEPTION: "EXCEPTION",
  COMPLETION: "COMPLETION",
  RETIREMENT: "RETIREMENT"
} as const;
export type DecisionTypeValue = typeof DecisionType[keyof typeof DecisionType];
