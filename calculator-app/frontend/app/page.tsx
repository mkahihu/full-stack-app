/**
 * Main page component - Calculator App Layout
 */
"use client";

import {
  ChakraProvider,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  useColorMode,
  IconButton,
  Box,
} from "@chakra-ui/react";
import Calculator from "../components/Calculator";
import History from "../components/History";
import ToggleDisplay from "../components/ToggleDisplay";
import { useCalculator } from "../hooks/useCalculator";

function CalculatorApp() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { showFraction, toggleFraction } = useCalculator();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        {/* Header */}
        <Box textAlign="center">
          <HStack justify="center" spacing={4} mb={2}>
            <Heading as="h1" size="xl" color="blue.500">
              Calculator App
            </Heading>
            <IconButton
              aria-label="Toggle color mode"
              icon={<span>{colorMode === "light" ? "🌙" : "☀️"}</span>}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </HStack>
          <Text color="gray.500">
            Full-stack calculator with history and fraction support
          </Text>
        </Box>

        {/* Main Content */}
        <HStack spacing={8} align="start" wrap="wrap" justify="center">
          {/* Calculator Section */}
          <VStack spacing={4}>
            <ToggleDisplay
              showFraction={showFraction}
              onToggleFraction={toggleFraction}
            />
            <Calculator />
          </VStack>

          {/* History Section */}
          <History />
        </HStack>
      </VStack>
    </Container>
  );
}

export default function Page() {
  return (
    <ChakraProvider>
      <CalculatorApp />
    </ChakraProvider>
  );
}
