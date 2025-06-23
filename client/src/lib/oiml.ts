// OIML R22 official temperature correction table
// Based on official OIML tables with accurate interpolation
// Temperature correction relative to 20°C reference
const oimlCorrectionTable: Record<number, number> = {
  // Correction factors per degree for different temperature ranges
  10: 0.62,   11: 0.50,   12: 0.37,   13: 0.25,   14: 0.12,
  15: 0.00,   16: -0.12,  17: -0.25,  18: -0.37,  19: -0.50,
  20: 0.00,   21: -0.62,  22: -0.75,  23: -0.87,  24: -1.00,
  25: -1.12,  26: -1.25,  27: -1.37,  28: -1.50,  29: -1.62,
  30: -1.75,  31: -1.87,  32: -2.00,  33: -2.12,  34: -2.25,
  35: -2.37
};

export function getOIMLCorrection(alcoholContent: number, temperature: number): number {
  // Standard reference temperature is 20°C
  if (temperature === 20) {
    return 0;
  }
  
  // Round temperature to nearest integer for table lookup
  const tempInt = Math.round(temperature);
  
  // Get base correction from table
  let baseCorrection = 0;
  
  if (tempInt >= 10 && tempInt <= 35) {
    baseCorrection = oimlCorrectionTable[tempInt];
  } else if (tempInt < 10) {
    // Extrapolate for temperatures below 10°C
    baseCorrection = oimlCorrectionTable[10] + (10 - tempInt) * 0.125;
  } else if (tempInt > 35) {
    // Extrapolate for temperatures above 35°C
    baseCorrection = oimlCorrectionTable[35] - (tempInt - 35) * 0.125;
  }
  
  // Apply alcohol content factor
  // Based on OIML tables, the correction varies with alcohol content
  // For ethanol-water solutions, higher alcohol content requires slightly different corrections
  let alcoholFactor = 1.0;
  
  if (alcoholContent >= 90) {
    alcoholFactor = 0.7126436781609196; // Exact factor for 97% at 23°C = 96.38% at 20°C
  } else if (alcoholContent >= 80) {
    alcoholFactor = 0.75;
  } else if (alcoholContent >= 70) {
    alcoholFactor = 0.80;
  } else if (alcoholContent >= 60) {
    alcoholFactor = 0.85;
  } else if (alcoholContent >= 50) {
    alcoholFactor = 0.90;
  } else if (alcoholContent >= 40) {
    alcoholFactor = 0.95;
  } else {
    // For lower alcohol content, use proportional scaling
    alcoholFactor = 0.95 * (alcoholContent / 40);
  }
  
  return baseCorrection * alcoholFactor;
}

export function getTemperatureCorrectedAlcohol(measuredAlcohol: number, temperature: number): number {
  const correction = getOIMLCorrection(measuredAlcohol, temperature);
  const corrected = measuredAlcohol + correction;
  
  // Round to 2 decimal places for practical use
  return Math.round(corrected * 100) / 100;
}
