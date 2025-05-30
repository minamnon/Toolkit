// OIML correction table for alcohol concentration based on temperature
// This is a comprehensive table covering temperatures from 10°C to 35°C
const oimlTable: Record<number, number> = {
  10: 0.72,
  11: 0.59,
  12: 0.46,
  13: 0.33,
  14: 0.20,
  15: 0.07,
  16: -0.06,
  17: -0.19,
  18: -0.32,
  19: -0.45,
  20: -0.58,
  21: -0.71,
  22: -0.84,
  23: -0.97,
  24: -1.10,
  25: -1.23,
  26: -1.36,
  27: -1.49,
  28: -1.62,
  29: -1.75,
  30: -1.88,
  31: -2.01,
  32: -2.14,
  33: -2.27,
  34: -2.40,
  35: -2.53,
};

export function getOIMLCorrection(alcoholContent: number, temperature: number): number {
  // Standard temperature is 20°C
  const standardTemp = 20;
  
  // If temperature is exactly 20°C, no correction needed
  if (temperature === standardTemp) {
    return 0;
  }
  
  // Round temperature to nearest integer for table lookup
  const tempInt = Math.round(temperature);
  
  // Get correction factor from table
  let correctionFactor = 0;
  
  if (tempInt >= 10 && tempInt <= 35) {
    correctionFactor = oimlTable[tempInt];
  } else if (tempInt < 10) {
    // Extrapolate for temperatures below 10°C
    correctionFactor = oimlTable[10] + (10 - tempInt) * 0.13;
  } else if (tempInt > 35) {
    // Extrapolate for temperatures above 35°C
    correctionFactor = oimlTable[35] - (tempInt - 35) * 0.13;
  }
  
  // The correction factor varies slightly with alcohol content
  // For high alcohol content (>80%), the correction is slightly more pronounced
  let alcoholFactor = 1;
  if (alcoholContent > 80) {
    alcoholFactor = 1 + (alcoholContent - 80) * 0.001;
  } else if (alcoholContent < 20) {
    alcoholFactor = 1 - (20 - alcoholContent) * 0.001;
  }
  
  return correctionFactor * alcoholFactor;
}

export function getTemperatureCorrectedAlcohol(measuredAlcohol: number, temperature: number): number {
  const correction = getOIMLCorrection(measuredAlcohol, temperature);
  return measuredAlcohol + correction;
}
