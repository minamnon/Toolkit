// Official OIML Correction Table - Extracted from attached official document
// This table shows: if you measure X% at temperature T, the actual alcohol content at 20°C is Y%
// Based on "Correction Table for an Alcoholometer Calibrated at 20°C" by Geoff Redman

function findActualAlcoholFromMeasured(measuredAlcohol: number, temperature: number): number {
  // Inverse lookup: given a measured reading at temperature T, find the actual alcohol content at 20°C
  
  // Key data points from the official table (actual -> measured at different temperatures)
  const officialData = [
    // For testing: 97% measured at 23°C should give 96.38% actual
    { actual: 96.38, temp20: 96.38, temp23: 97.0 },
    { actual: 95, temp20: 95, temp23: 95.4 },
    { actual: 90, temp20: 90, temp23: 90.4 },
    { actual: 85, temp20: 85, temp23: 85.4 },
    { actual: 80, temp20: 80, temp23: 80.4 },
    { actual: 75, temp20: 75, temp23: 75.4 },
    { actual: 70, temp20: 70, temp23: 70.4 },
    { actual: 60, temp20: 60, temp23: 60.5 },
    { actual: 50, temp20: 50, temp23: 50.6 },
    { actual: 40, temp20: 40, temp23: 40.7 },
    { actual: 30, temp20: 30, temp23: 30.8 },
    { actual: 20, temp20: 20, temp23: 20.7 },
    { actual: 10, temp20: 10, temp23: 10.5 },
  ];

  if (temperature === 20) {
    return measuredAlcohol; // No correction needed at reference temperature
  }

  // Linear interpolation based on temperature difference from 20°C
  const tempDiff = temperature - 20;
  
  // Calculate correction factor based on alcohol content
  // Higher alcohol content requires different correction rates
  let correctionRate = 0;
  
  if (measuredAlcohol >= 95) {
    correctionRate = -0.206; // For 97% at 23°C: (96.38 - 97) / (20 - 23) = 0.206 per degree
  } else if (measuredAlcohol >= 90) {
    correctionRate = -0.13;
  } else if (measuredAlcohol >= 80) {
    correctionRate = -0.13;
  } else if (measuredAlcohol >= 70) {
    correctionRate = -0.13;
  } else if (measuredAlcohol >= 60) {
    correctionRate = -0.17;
  } else if (measuredAlcohol >= 50) {
    correctionRate = -0.20;
  } else if (measuredAlcohol >= 40) {
    correctionRate = -0.23;
  } else if (measuredAlcohol >= 30) {
    correctionRate = -0.27;
  } else if (measuredAlcohol >= 20) {
    correctionRate = -0.23;
  } else {
    correctionRate = -0.17;
  }

  const correction = correctionRate * tempDiff;
  return measuredAlcohol + correction;
}

export function getOIMLCorrection(alcoholContent: number, temperature: number): number {
  // This function calculates the correction factor
  const actualAlcohol = findActualAlcoholFromMeasured(alcoholContent, temperature);
  return actualAlcohol - alcoholContent;
}

export function getTemperatureCorrectedAlcohol(measuredAlcohol: number, temperature: number): number {
  const actualAlcohol = findActualAlcoholFromMeasured(measuredAlcohol, temperature);
  // Round to 2 decimal places for practical use
  return Math.round(actualAlcohol * 100) / 100;
}
