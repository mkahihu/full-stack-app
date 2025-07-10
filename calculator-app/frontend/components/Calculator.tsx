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
import { useCalculator } from "../hooks/useCalculator";

export default function Calculator() {
  const {
    display,
    isLoading,
    error,
    showFraction,
    inputNumber,
    inputOperator,
    calculate,
    clear,
    backspace,
    toggleFraction,
  } = useCalculator();

  const bgColor = useColorModeValue("white", "gray.800");
  const displayBg = useColorModeValue("gray.50", "gray.700");

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
