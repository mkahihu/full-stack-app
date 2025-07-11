import { CALCULATOR_CONSTANTS } from "../constants/calculator";

export const validateExpression = (expression: string): boolean => {
  // Use constants for validation
  const operatorPattern = new RegExp(
    `[${CALCULATOR_CONSTANTS.OPERATORS.join("")}]{2,}`
  );
  if (operatorPattern.test(expression)) return false;

  // Check for invalid starting characters
  const invalidStart = new RegExp(
    `^[${CALCULATOR_CONSTANTS.OPERATORS.slice(2).join("")}]`
  );
  if (invalidStart.test(expression)) return false;

  // Check for invalid ending characters
  const invalidEnd = new RegExp(
    `[${CALCULATOR_CONSTANTS.OPERATORS.join("")}]$`
  );
  if (invalidEnd.test(expression)) return false;

  return true;
};

export const formatDisplayValue = (value: string): string => {
  if (value.length > CALCULATOR_CONSTANTS.MAX_DISPLAY_LENGTH) {
    return parseFloat(value).toExponential(
      CALCULATOR_CONSTANTS.DECIMAL_PRECISION - 4
    );
  }
  return value;
};
