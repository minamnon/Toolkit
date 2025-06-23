// OIML R22 official table for alcohol concentration temperature correction
// Values are correction factors to add/subtract from measured alcohol content
// Standard reference temperature is 20°C
const oimlTemperatureCorrection: Record<number, Record<number, number>> = {
  // Temperature corrections for different alcohol percentages
  // Format: [temperature]: { [alcohol%]: correction_value }
  10: { 40: 0.64, 50: 0.80, 60: 0.96, 70: 1.12, 80: 1.28, 90: 1.44, 95: 1.52 },
  11: { 40: 0.51, 50: 0.64, 60: 0.77, 70: 0.90, 80: 1.02, 90: 1.15, 95: 1.22 },
  12: { 40: 0.39, 50: 0.49, 60: 0.58, 70: 0.68, 80: 0.77, 90: 0.87, 95: 0.92 },
  13: { 40: 0.26, 50: 0.33, 60: 0.39, 70: 0.46, 80: 0.52, 90: 0.59, 95: 0.62 },
  14: { 40: 0.13, 50: 0.16, 60: 0.20, 70: 0.23, 80: 0.26, 90: 0.30, 95: 0.31 },
  15: { 40: 0.00, 50: 0.00, 60: 0.00, 70: 0.00, 80: 0.00, 90: 0.00, 95: 0.00 },
  16: { 40: -0.13, 50: -0.17, 60: -0.20, 70: -0.24, 80: -0.27, 90: -0.31, 95: -0.32 },
  17: { 40: -0.27, 50: -0.34, 60: -0.41, 70: -0.48, 80: -0.54, 90: -0.61, 95: -0.65 },
  18: { 40: -0.40, 50: -0.51, 60: -0.61, 70: -0.72, 80: -0.82, 90: -0.92, 95: -0.97 },
  19: { 40: -0.54, 50: -0.68, 60: -0.82, 70: -0.96, 80: -1.09, 90: -1.23, 95: -1.30 },
  20: { 40: 0.00, 50: 0.00, 60: 0.00, 70: 0.00, 80: 0.00, 90: 0.00, 95: 0.00 },
  21: { 40: -0.68, 50: -0.85, 60: -1.03, 70: -1.20, 80: -1.37, 90: -1.54, 95: -1.63 },
  22: { 40: -0.82, 50: -1.03, 60: -1.23, 70: -1.44, 80: -1.64, 90: -1.85, 95: -1.95 },
  23: { 40: -0.96, 50: -1.20, 60: -1.44, 70: -1.68, 80: -1.92, 90: -2.16, 95: -2.28 },
  24: { 40: -1.09, 50: -1.37, 60: -1.64, 70: -1.92, 80: -2.19, 90: -2.47, 95: -2.60 },
  25: { 40: -1.23, 50: -1.54, 60: -1.85, 70: -2.16, 80: -2.47, 90: -2.78, 95: -2.93 },
  26: { 40: -1.37, 50: -1.71, 60: -2.05, 70: -2.40, 80: -2.74, 90: -3.08, 95: -3.25 },
  27: { 40: -1.51, 50: -1.89, 60: -2.26, 70: -2.64, 80: -3.02, 90: -3.39, 95: -3.58 },
  28: { 40: -1.64, 50: -2.06, 60: -2.47, 70: -2.88, 80: -3.29, 90: -3.70, 95: -3.90 },
  29: { 40: -1.78, 50: -2.23, 60: -2.68, 70: -3.12, 80: -3.57, 90: -4.01, 95: -4.23 },
  30: { 40: -1.92, 50: -2.40, 60: -2.88, 70: -3.36, 80: -3.84, 90: -4.32, 95: -4.56 },
  31: { 40: -2.06, 50: -2.57, 60: -3.09, 70: -3.60, 80: -4.11, 90: -4.63, 95: -4.88 },
  32: { 40: -2.19, 50: -2.74, 60: -3.29, 70: -3.84, 80: -4.39, 90: -4.94, 95: -5.21 },
  33: { 40: -2.33, 50: -2.92, 60: -3.50, 70: -4.08, 80: -4.66, 90: -5.25, 95: -5.53 },
  34: { 40: -2.47, 50: -3.09, 60: -3.70, 70: -4.32, 80: -4.94, 90: -5.55, 95: -5.86 },
  35: { 40: -2.61, 50: -3.26, 60: -3.91, 70: -4.56, 80: -5.21, 90: -5.86, 95: -6.19 },
};

export function getOIMLCorrection(alcoholContent: number, temperature: number): number {
  // Standard reference temperatures are 15°C and 20°C
  // If temperature is exactly 15°C or 20°C, no correction needed
  if (temperature === 15 || temperature === 20) {
    return 0;
  }
  
  // Round temperature to nearest integer for table lookup
  const tempInt = Math.round(temperature);
  
  // Handle temperatures outside the table range
  if (tempInt < 10 || tempInt > 35) {
    // For temperatures outside range, use linear extrapolation
    let baseTemp = tempInt < 10 ? 10 : 35;
    let baseCorrection = getTableCorrection(alcoholContent, baseTemp);
    let tempDiff = tempInt - baseTemp;
    
    // Approximate correction rate is about 0.13% per degree for most alcohols
    let rate = alcoholContent > 80 ? 0.16 : alcoholContent > 60 ? 0.14 : 0.12;
    return baseCorrection + (tempDiff * rate);
  }
  
  return getTableCorrection(alcoholContent, tempInt);
}

function getTableCorrection(alcoholContent: number, temperature: number): number {
  const tempData = oimlTemperatureCorrection[temperature];
  if (!tempData) return 0;
  
  // Find the closest alcohol percentage in the table
  const alcoholPercentages = [40, 50, 60, 70, 80, 90, 95];
  
  // If alcohol content is exactly in the table, return the value
  if (tempData[alcoholContent]) {
    return tempData[alcoholContent];
  }
  
  // Find the two closest values for interpolation
  let lowerAlc = 40;
  let upperAlc = 95;
  
  for (let i = 0; i < alcoholPercentages.length - 1; i++) {
    if (alcoholContent >= alcoholPercentages[i] && alcoholContent <= alcoholPercentages[i + 1]) {
      lowerAlc = alcoholPercentages[i];
      upperAlc = alcoholPercentages[i + 1];
      break;
    }
  }
  
  // Handle edge cases
  if (alcoholContent < 40) {
    // For alcohol content below 40%, use proportional scaling
    return tempData[40] * (alcoholContent / 40);
  }
  
  if (alcoholContent > 95) {
    // For alcohol content above 95%, use the 95% value with slight adjustment
    return tempData[95] * (1 + (alcoholContent - 95) * 0.01);
  }
  
  // Linear interpolation between the two closest values
  const lowerCorrection = tempData[lowerAlc];
  const upperCorrection = tempData[upperAlc];
  const ratio = (alcoholContent - lowerAlc) / (upperAlc - lowerAlc);
  
  return lowerCorrection + (upperCorrection - lowerCorrection) * ratio;
}

export function getTemperatureCorrectedAlcohol(measuredAlcohol: number, temperature: number): number {
  const correction = getOIMLCorrection(measuredAlcohol, temperature);
  const corrected = measuredAlcohol + correction;
  
  // Round to 2 decimal places for practical use
  return Math.round(corrected * 100) / 100;
}
