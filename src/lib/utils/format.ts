/**
 * Format an integer INR value into Indian Rupee display format (e.g. ₹8,499 or ₹12,999).
 */
export function formatINR(amount: number, includePrefix = false): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
  return includePrefix ? `From ${formatted}` : formatted;
}

/**
 * Alias for formatINR used across storefront components.
 */
export function formatInr(amount: number, includePrefix = false): string {
  return formatINR(amount, includePrefix);
}

/**
 * Format a starting price (e.g. "From ₹3,999").
 */
export function formatStartingPrice(amount: number): string {
  return formatINR(amount, true);
}

/**
 * Convert centimeters to inches (1 decimal place).
 */
export function cmToInches(cm: number): number {
  return Number((cm / 2.54).toFixed(1));
}

/**
 * Convert inches to centimeters (1 decimal place).
 */
export function inchesToCm(inches: number): number {
  return Number((inches * 2.54).toFixed(1));
}

/**
 * Convert between centimeters and inches with 1 decimal precision.
 */
export function convertMeasurement(
  value: number,
  fromUnit: "cm" | "in",
  toUnit: "cm" | "in"
): number {
  if (fromUnit === toUnit) return value;
  if (fromUnit === "cm" && toUnit === "in") {
    return cmToInches(value);
  }
  return inchesToCm(value);
}
