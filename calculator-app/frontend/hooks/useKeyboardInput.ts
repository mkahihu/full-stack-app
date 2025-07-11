import { useEffect } from "react";
import { CALCULATOR_CONSTANTS } from "../constants/calculator";

export const useKeyboardInput = ({
  inputNumber,
  inputOperator,
  calculate,
  clear,
  backspace,
}: {
  inputNumber: (num: string) => void;
  inputOperator: (op: string) => void;
  calculate: () => void;
  clear: () => void;
  backspace: () => void;
}) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      // Use constants for validation
      if (CALCULATOR_CONSTANTS.NUMBERS.includes(key as any) || key === ".") {
        inputNumber(key);
      } else if (CALCULATOR_CONSTANTS.OPERATORS.includes(key as any)) {
        inputOperator(key);
      } else if (key === "Enter" || key === "=") {
        calculate();
      } else if (key === "Escape" || key === "c" || key === "C") {
        clear();
      } else if (key === "Backspace") {
        backspace();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [inputNumber, inputOperator, calculate, clear, backspace]);
};
