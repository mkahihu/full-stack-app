/**
 * Custom hook for calculator functionality
 */
import { useState, useCallback } from "react";
import { calculatorApi, CalculationResponse } from "../services/api";
import {
  decimalToFraction,
  formatFraction,
  simplifyFraction,
} from "../utils/fractionUtils";

export interface UseCalculatorReturn {
  display: string;
  history: CalculationResponse[];
  isLoading: boolean;
  error: string | null;
  showFraction: boolean;
  inputNumber: (num: string) => void;
  inputOperator: (operator: string) => void;
  calculate: () => Promise<void>;
  clear: () => void;
  backspace: () => void;
  toggleFraction: () => void;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
}

export function useCalculator(): UseCalculatorReturn {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<CalculationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFraction, setShowFraction] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);

  /**
   * Input a number or decimal point
   */
  const inputNumber = useCallback((num: string) => {
    setError(null);
    setDisplay((prev) => {
      if (prev === "0" && num !== ".") return num;
      if (num === "." && prev.includes(".")) return prev;
      return prev + num;
    });
  }, []);

  /**
   * Input an operator (+, -, *, /)
   */
  const inputOperator = useCallback((operator: string) => {
    setError(null);
    setDisplay((prev) => {
      const lastChar = prev.slice(-1);
      if (["+", "-", "*", "/"].includes(lastChar)) {
        return prev.slice(0, -1) + operator;
      }
      return prev + operator;
    });
  }, []);

  /**
   * Calculate the expression
   */
  const calculate = useCallback(async () => {
    if (!display || display === "0") return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await calculatorApi.calculate(display);
      setLastResult(result.result);

      if (showFraction) {
        const fraction = simplifyFraction(decimalToFraction(result.result));
        setDisplay(formatFraction(fraction));
      } else {
        setDisplay(result.result.toString());
      }

      // Add to history
      setHistory((prev) => [result, ...prev]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Calculation error";
      setError(errorMessage);
      setDisplay("Error");
    } finally {
      setIsLoading(false);
    }
  }, [display, showFraction]);

  /**
   * Clear the calculator
   */
  const clear = useCallback(() => {
    setDisplay("0");
    setError(null);
    setLastResult(null);
  }, []);

  /**
   * Remove last character
   */
  const backspace = useCallback(() => {
    setError(null);
    setDisplay((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  }, []);

  /**
   * Toggle between decimal and fraction display
   */
  const toggleFraction = useCallback(() => {
    setShowFraction((prev) => {
      const newShowFraction = !prev;

      if (lastResult !== null) {
        if (newShowFraction) {
          const fraction = simplifyFraction(decimalToFraction(lastResult));
          setDisplay(formatFraction(fraction));
        } else {
          setDisplay(lastResult.toString());
        }
      }

      return newShowFraction;
    });
  }, [lastResult]);

  /**
   * Clear calculation history
   */
  const clearHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      await calculatorApi.clearHistory();
      setHistory([]);
    } catch (err) {
      setError("Failed to clear history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load calculation history
   */
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await calculatorApi.getHistory();
      setHistory(response.calculations);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    display,
    history,
    isLoading,
    error,
    showFraction,
    inputNumber,
    inputOperator,
    calculate,
    clear,
    backspace,
    toggleFraction,
    clearHistory,
    loadHistory,
  };
}
