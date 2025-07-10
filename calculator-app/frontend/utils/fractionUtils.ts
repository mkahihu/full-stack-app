/**
 * Utility functions for fraction conversion and formatting
 */

interface Fraction {
  numerator: number;
  denominator: number;
}

/**
 * Convert decimal to fraction using continued fractions algorithm
 */
export function decimalToFraction(
  decimal: number,
  maxDenominator = 1000
): Fraction {
  if (decimal === 0) return { numerator: 0, denominator: 1 };

  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);

  let wholePart = Math.floor(decimal);
  let fractionalPart = decimal - wholePart;

  if (fractionalPart === 0) {
    return { numerator: wholePart * sign, denominator: 1 };
  }

  // Continued fractions algorithm
  let h1 = 1,
    h2 = 0;
  let k1 = 0,
    k2 = 1;
  let b = fractionalPart;

  do {
    let a = Math.floor(1 / b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / b - a;
  } while (
    Math.abs(decimal - h1 / k1) > 1 / (2 * k1 * k1) &&
    k1 <= maxDenominator
  );

  const numerator = (wholePart * k1 + h1) * sign;
  const denominator = k1;

  return { numerator, denominator };
}

/**
 * Format fraction as string
 */
export function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return fraction.numerator.toString();
  }

  if (Math.abs(fraction.numerator) > fraction.denominator) {
    const wholePart = Math.floor(
      Math.abs(fraction.numerator) / fraction.denominator
    );
    const remainder = Math.abs(fraction.numerator) % fraction.denominator;
    const sign = fraction.numerator < 0 ? "-" : "";

    if (remainder === 0) {
      return `${sign}${wholePart}`;
    }

    return `${sign}${wholePart} ${remainder}/${fraction.denominator}`;
  }

  return `${fraction.numerator}/${fraction.denominator}`;
}

/**
 * Simplify fraction by finding GCD
 */
export function simplifyFraction(fraction: Fraction): Fraction {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.abs(fraction.numerator), fraction.denominator);

  return {
    numerator: fraction.numerator / divisor,
    denominator: fraction.denominator / divisor,
  };
}
