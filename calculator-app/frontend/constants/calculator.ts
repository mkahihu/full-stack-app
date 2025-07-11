export const CALCULATOR_CONSTANTS = {
  OPERATORS: ["+", "-", "*", "/"] as const,
  NUMBERS: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const,
  MAX_DISPLAY_LENGTH: 20,
  DECIMAL_PRECISION: 10,
  HISTORY_PAGE_SIZE: 50,
  STALE_TIME: 30000, // 30 seconds
} as const;

export const BUTTON_COLORS = {
  NUMBER: "gray",
  OPERATOR: "blue",
  EQUALS: "green",
  CLEAR: "red",
  BACKSPACE: "orange",
  FRACTION_TOGGLE: "purple",
} as const;

// Type exports for better TypeScript support
export type CalculatorOperator =
  (typeof CALCULATOR_CONSTANTS.OPERATORS)[number];
export type CalculatorNumber = (typeof CALCULATOR_CONSTANTS.NUMBERS)[number];
export type ButtonColor = (typeof BUTTON_COLORS)[keyof typeof BUTTON_COLORS];
