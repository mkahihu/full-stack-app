/**
 * Main Calculator component with button grid and display
 */
"use client";

import {
  Box,
  Button,
  Grid,
  Text,
  VStack,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState, useCallback, useMemo } from "react";
import { useCalculate } from "@/api/endpoints/calculator/apiQueries";
import {
  decimalToFraction,
  simplifyFraction,
  formatFraction,
} from "@/utils/fractionUtils";
import CalculatorButton from "./CalculatorButton";
import { BUTTON_COLORS, CALCULATOR_CONSTANTS } from "@/constants/calculator";

export default function Calculator() {
  // Local state for calculator display and input
  const [display, setDisplay] = useState("0");
  const [showFraction, setShowFraction] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // React Query hook for calculations
  const calculateMutation = useCalculate();

  const bgColor = useColorModeValue("white", "gray.800");
  const displayBg = useColorModeValue("gray.50", "gray.700");

  // Input handlers
  const inputNumber = useCallback((num: string) => {
    setError(null);
    setDisplay((prev) => {
      if (prev === "0" && num !== ".") return num;
      if (num === "." && prev.includes(".")) return prev;
      return prev + num;
    });
  }, []);

  // const inputOperator = useCallback((operator: string) => {
  //   setError(null);
  //   setDisplay((prev) => {
  //     const lastChar = prev.slice(-1);
  //     if (["+", "-", "*", "/"].includes(lastChar)) {
  //       return prev.slice(0, -1) + operator;
  //     }
  //     return prev + operator;
  //   });
  // }, []);

  const inputOperator = useCallback((operator: string) => {
    setError(null);
    setDisplay((prev) => {
      const lastChar = prev.slice(-1);
      // Use constants for operator validation
      if (CALCULATOR_CONSTANTS.OPERATORS.includes(lastChar as any)) {
        return prev.slice(0, -1) + operator;
      }
      return prev + operator;
    });
  }, []);

  const clear = useCallback(() => {
    setDisplay("0");
    setError(null);
    setLastResult(null);
  }, []);

  const backspace = useCallback(() => {
    setError(null);
    setDisplay((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  }, []);

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

  // Calculate function using React Query
  const calculate = useCallback(async () => {
    if (!display || display === "0" || display === "Error") return;

    try {
      const result = await calculateMutation.mutateAsync({
        expression: display,
      });
      setLastResult(result.result);
      setError(null);

      if (showFraction) {
        const fraction = simplifyFraction(decimalToFraction(result.result));
        setDisplay(formatFraction(fraction));
      } else {
        setDisplay(result.result.toString());
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Calculation error";
      setError(errorMessage);
      setDisplay("Error");
    }
  }, [display, showFraction, calculateMutation]);

  // const buttonConfig = [
  //   // Row 1
  //   { label: "C", action: clear, colorScheme: "red", span: 2 },
  //   { label: "⌫", action: backspace, colorScheme: "orange" },
  //   { label: "/", action: () => inputOperator("/"), colorScheme: "blue" },

  //   // Row 2
  //   { label: "7", action: () => inputNumber("7") },
  //   { label: "8", action: () => inputNumber("8") },
  //   { label: "9", action: () => inputNumber("9") },
  //   { label: "*", action: () => inputOperator("*"), colorScheme: "blue" },

  //   // Row 3
  //   { label: "4", action: () => inputNumber("4") },
  //   { label: "5", action: () => inputNumber("5") },
  //   { label: "6", action: () => inputNumber("6") },
  //   { label: "-", action: () => inputOperator("-"), colorScheme: "blue" },

  //   // Row 4
  //   { label: "1", action: () => inputNumber("1") },
  //   { label: "2", action: () => inputNumber("2") },
  //   { label: "3", action: () => inputNumber("3") },
  //   { label: "+", action: () => inputOperator("+"), colorScheme: "blue" },

  //   // Row 5
  //   { label: "0", action: () => inputNumber("0"), span: 2 },
  //   { label: ".", action: () => inputNumber(".") },
  //   { label: "=", action: calculate, colorScheme: "green" },
  // ];

  // Get loading state from React Query
  const isLoading = calculateMutation.isPending;
  // Memoize button actions to prevent re-creation on each render
  // const numberActions = useMemo(
  //   () => ({
  //     0: () => inputNumber("0"),
  //     1: () => inputNumber("1"),
  //     2: () => inputNumber("2"),
  //     3: () => inputNumber("3"),
  //     4: () => inputNumber("4"),
  //     5: () => inputNumber("5"),
  //     6: () => inputNumber("6"),
  //     7: () => inputNumber("7"),
  //     8: () => inputNumber("8"),
  //     9: () => inputNumber("9"),
  //     ".": () => inputNumber("."),
  //   }),
  //   [inputNumber]
  // );
  const numberActions = useMemo(
    () =>
      CALCULATOR_CONSTANTS.NUMBERS.reduce(
        (acc, num) => ({
          ...acc,
          [num]: () => inputNumber(num),
        }),
        {} as Record<string, () => void>
      ),
    [inputNumber]
  );
  const operatorActions = useMemo(
    () =>
      CALCULATOR_CONSTANTS.OPERATORS.reduce(
        (acc, op) => ({
          ...acc,
          [op]: () => inputOperator(op),
        }),
        {} as Record<string, () => void>
      ),
    [inputOperator]
  );
  // const operatorActions = useMemo(
  //   () => ({
  //     "+": () => inputOperator("+"),
  //     "-": () => inputOperator("-"),
  //     "*": () => inputOperator("*"),
  //     "/": () => inputOperator("/"),
  //   }),
  //   [inputOperator]
  // );

  // Static button configuration
  // const buttonConfig = useMemo(
  //   () => [
  //     { label: "C", action: clear, colorScheme: "red", span: 2 },
  //     { label: "⌫", action: backspace, colorScheme: "orange" },
  //     { label: "/", action: operatorActions["/"], colorScheme: "blue" },
  //     // ... rest of buttons using the memoized actions
  //   ],
  //   [clear, backspace, numberActions, operatorActions]
  // );
  // Button configuration using constants
  const buttonConfig = useMemo(
    () => [
      {
        label: "C",
        action: clear,
        colorScheme: BUTTON_COLORS.CLEAR,
        span: 2,
        ariaLabel: "Clear all",
      },
      {
        label: "⌫",
        action: backspace,
        colorScheme: BUTTON_COLORS.BACKSPACE,
        ariaLabel: "Backspace",
      },
      {
        label: "/",
        action: operatorActions["/"],
        colorScheme: BUTTON_COLORS.OPERATOR,
        ariaLabel: "Divide",
      },

      // Number buttons using constants
      ...CALCULATOR_CONSTANTS.NUMBERS.slice(7, 10).map((num) => ({
        label: num,
        action: numberActions[num],
        colorScheme: BUTTON_COLORS.NUMBER,
        ariaLabel: `Number ${num}`,
      })),
      {
        label: "*",
        action: operatorActions["*"],
        colorScheme: BUTTON_COLORS.OPERATOR,
        ariaLabel: "Multiply",
      },
      ...CALCULATOR_CONSTANTS.NUMBERS.slice(4, 7).map((num) => ({
        label: num,
        action: numberActions[num],
        colorScheme: BUTTON_COLORS.NUMBER,
        ariaLabel: `Number ${num}`,
      })),
      {
        label: "-",
        action: operatorActions["-"],
        colorScheme: BUTTON_COLORS.OPERATOR,
        ariaLabel: "Subtract",
      },

      ...CALCULATOR_CONSTANTS.NUMBERS.slice(1, 4).map((num) => ({
        label: num,
        action: numberActions[num],
        colorScheme: BUTTON_COLORS.NUMBER,
        ariaLabel: `Number ${num}`,
      })),
      {
        label: "+",
        action: operatorActions["+"],
        colorScheme: BUTTON_COLORS.OPERATOR,
        ariaLabel: "Add",
      },
      {
        label: "0",
        action: numberActions["0"],
        colorScheme: BUTTON_COLORS.NUMBER,
        span: 2,
        ariaLabel: "Number zero",
      },
      {
        label: ".",
        action: () => inputNumber("."),
        colorScheme: BUTTON_COLORS.NUMBER,
        ariaLabel: "Decimal point",
      },
      {
        label: "=",
        action: calculate,
        colorScheme: BUTTON_COLORS.EQUALS,
        ariaLabel: "Equals",
      },
    ],
    [clear, backspace, numberActions, operatorActions, calculate]
  );
  // Format display value using constants
  const formatDisplayValue = (value: string): string => {
    if (value.length > CALCULATOR_CONSTANTS.MAX_DISPLAY_LENGTH) {
      const numValue = parseFloat(value);
      return numValue.toExponential(CALCULATOR_CONSTANTS.DECIMAL_PRECISION - 4);
    }
    return value;
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      maxW="400px"
      w="full"
    >
      <VStack spacing={4}>
        {/* Display */}
        <Box
          w="full"
          bg={displayBg}
          p={4}
          borderRadius="md"
          textAlign="right"
          minH="80px"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            wordBreak="break-all"
            color={error ? "red.500" : undefined}
          >
            {formatDisplayValue(display)}
          </Text>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Fraction Toggle */}
        <Button
          onClick={toggleFraction}
          colorScheme={showFraction ? "purple" : "gray"}
          variant={showFraction ? "solid" : "outline"}
          size="sm"
          w="full"
        >
          {showFraction ? "Show Decimal" : "Show Fraction"}
        </Button>

        {/* Button Grid */}
        <Grid templateColumns="repeat(4, 1fr)" gap={2} w="full">
          {/* Row 1 - Functions */}
          <CalculatorButton
            label="C"
            onClick={clear}
            colorScheme="red"
            span={2}
          />
          <CalculatorButton
            label="⌫"
            onClick={backspace}
            colorScheme="orange"
          />
          <CalculatorButton
            label="/"
            onClick={() => inputOperator("/")}
            colorScheme="blue"
          />

          {/* Row 2 */}
          <CalculatorButton label="7" onClick={() => inputNumber("7")} />
          <CalculatorButton label="8" onClick={() => inputNumber("8")} />
          <CalculatorButton label="9" onClick={() => inputNumber("9")} />
          <CalculatorButton
            label="*"
            onClick={() => inputOperator("*")}
            colorScheme="blue"
          />

          {/* Row 3 */}
          <CalculatorButton label="4" onClick={() => inputNumber("4")} />
          <CalculatorButton label="5" onClick={() => inputNumber("5")} />
          <CalculatorButton label="6" onClick={() => inputNumber("6")} />
          <CalculatorButton
            label="-"
            onClick={() => inputOperator("-")}
            colorScheme="blue"
          />

          {/* Row 4 */}
          <CalculatorButton label="1" onClick={() => inputNumber("1")} />
          <CalculatorButton label="2" onClick={() => inputNumber("2")} />
          <CalculatorButton label="3" onClick={() => inputNumber("3")} />
          <CalculatorButton
            label="+"
            onClick={() => inputOperator("+")}
            colorScheme="blue"
          />

          {/* Row 5 */}
          <CalculatorButton
            label="0"
            onClick={() => inputNumber("0")}
            span={2}
          />
          <CalculatorButton label="." onClick={() => inputNumber(".")} />
          <CalculatorButton
            label="="
            onClick={calculate}
            colorScheme="green"
            isLoading={isLoading}
            loadingText="="
          />
        </Grid>
      </VStack>
    </Box>
  );
}
