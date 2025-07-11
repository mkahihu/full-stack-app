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
import { useState, useCallback } from "react";
import { useCalculate } from "@/api/endpoints/calculator/apiQueries";
import {
  decimalToFraction,
  simplifyFraction,
  formatFraction,
} from "@/utils/fractionUtils";

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

  const buttons = [
    { label: "C", action: clear, color: "red", span: 2 },
    { label: "⌫", action: backspace, color: "orange" },
    { label: "/", action: () => inputOperator("/"), color: "blue" },

    { label: "7", action: () => inputNumber("7") },
    { label: "8", action: () => inputNumber("8") },
    { label: "9", action: () => inputNumber("9") },
    { label: "*", action: () => inputOperator("*"), color: "blue" },

    { label: "4", action: () => inputNumber("4") },
    { label: "5", action: () => inputNumber("5") },
    { label: "6", action: () => inputNumber("6") },
    { label: "-", action: () => inputOperator("-"), color: "blue" },

    { label: "1", action: () => inputNumber("1") },
    { label: "2", action: () => inputNumber("2") },
    { label: "3", action: () => inputNumber("3") },
    { label: "+", action: () => inputOperator("+"), color: "blue" },

    { label: "0", action: () => inputNumber("0"), span: 2 },
    { label: ".", action: () => inputNumber(".") },
    { label: "=", action: calculate, color: "green" },
  ];

  // Get loading state from React Query
  const isLoading = calculateMutation.isPending;

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
            {display}
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
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.action}
              colorScheme={button.color || "gray"}
              size="lg"
              h="60px"
              fontSize="lg"
              fontWeight="bold"
              gridColumn={button.span ? `span ${button.span}` : undefined}
              isLoading={isLoading && button.label === "="}
              loadingText="="
            >
              {button.label}
            </Button>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
}
