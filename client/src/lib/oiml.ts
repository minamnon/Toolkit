// جدول التصحيح الرسمي OIML R22 - مستخرج من الوثيقة الرسمية المرفقة
// المصدر: "Correction Table for an Alcoholometer Calibrated at 20°C" by Geoff Redman

interface OfficialTableEntry {
  actualConcentration: number;
  measuredAtTemperatures: { [temp: number]: number };
}

// البيانات الدقيقة المستخرجة من الجدول الرسمي المرفق
const OFFICIAL_OIML_TABLE: OfficialTableEntry[] = [
  // التركيز الفعلي 97% عند 20°C
  {
    actualConcentration: 97,
    measuredAtTemperatures: {
      15: 95.6, 16: 95.8, 17: 96.0, 18: 96.2, 19: 96.4, 20: 97.0,
      21: 97.2, 22: 97.4, 23: 97.6, 24: 97.9, 25: 98.1, 26: 98.5, 27: 98.7, 28: 99.0, 29: 99.3, 30: 99.7
    }
  },
  // التركيز الفعلي 96% عند 20°C
  {
    actualConcentration: 96,
    measuredAtTemperatures: {
      15: 94.8, 16: 95.0, 17: 95.2, 18: 95.4, 19: 95.6, 20: 96.0,
      21: 96.2, 22: 96.4, 23: 96.6, 24: 96.8, 25: 97.0, 26: 97.3, 27: 97.6, 28: 97.8, 29: 98.1, 30: 98.5
    }
  },
  // التركيز الفعلي 95% عند 20°C
  {
    actualConcentration: 95,
    measuredAtTemperatures: {
      15: 94.0, 16: 94.2, 17: 94.4, 18: 94.6, 19: 94.8, 20: 95.0,
      21: 95.2, 22: 95.4, 23: 95.6, 24: 95.8, 25: 96.0, 26: 96.2, 27: 96.5, 28: 96.7, 29: 97.0, 30: 97.3
    }
  },
  // التركيز الفعلي 90% عند 20°C
  {
    actualConcentration: 90,
    measuredAtTemperatures: {
      15: 88.7, 16: 89.0, 17: 89.2, 18: 89.5, 19: 89.8, 20: 90.0,
      21: 90.2, 22: 90.5, 23: 90.7, 24: 91.0, 25: 91.2, 26: 91.5, 27: 91.7, 28: 92.0, 29: 92.2, 30: 92.5
    }
  },
  // التركيز الفعلي 85% عند 20°C
  {
    actualConcentration: 85,
    measuredAtTemperatures: {
      15: 83.4, 16: 83.7, 17: 84.1, 18: 84.4, 19: 84.7, 20: 85.0,
      21: 85.3, 22: 85.6, 23: 85.9, 24: 86.2, 25: 86.5, 26: 86.8, 27: 87.1, 28: 87.4, 29: 87.7, 30: 88.0
    }
  },
  // التركيز الفعلي 80% عند 20°C
  {
    actualConcentration: 80,
    measuredAtTemperatures: {
      15: 78.3, 16: 78.7, 17: 79.0, 18: 79.3, 19: 79.7, 20: 80.0,
      21: 80.3, 22: 80.7, 23: 81.0, 24: 81.3, 25: 81.7, 26: 82.0, 27: 82.3, 28: 82.7, 29: 83.0, 30: 83.3
    }
  },
  // التركيز الفعلي 70% عند 20°C
  {
    actualConcentration: 70,
    measuredAtTemperatures: {
      15: 68.4, 16: 68.7, 17: 69.0, 18: 69.3, 19: 69.7, 20: 70.0,
      21: 70.3, 22: 70.7, 23: 71.0, 24: 71.4, 25: 71.7, 26: 72.0, 27: 72.4, 28: 72.7, 29: 73.0, 30: 73.3
    }
  },
  // التركيز الفعلي 60% عند 20°C
  {
    actualConcentration: 60,
    measuredAtTemperatures: {
      15: 58.2, 16: 58.6, 17: 58.9, 18: 59.3, 19: 59.6, 20: 60.0,
      21: 60.3, 22: 60.7, 23: 61.0, 24: 61.4, 25: 61.7, 26: 62.0, 27: 62.4, 28: 62.7, 29: 63.0, 30: 63.3
    }
  },
  // التركيز الفعلي 50% عند 20°C
  {
    actualConcentration: 50,
    measuredAtTemperatures: {
      15: 47.9, 16: 48.4, 17: 48.8, 18: 49.2, 19: 49.6, 20: 50.0,
      21: 50.4, 22: 50.8, 23: 51.2, 24: 51.5, 25: 51.9, 26: 52.3, 27: 52.6, 28: 53.0, 29: 53.3, 30: 53.7
    }
  },
  // التركيز الفعلي 40% عند 20°C
  {
    actualConcentration: 40,
    measuredAtTemperatures: {
      15: 37.8, 16: 38.3, 17: 38.7, 18: 39.1, 19: 39.6, 20: 40.0,
      21: 40.4, 22: 40.9, 23: 41.3, 24: 41.7, 25: 42.2, 26: 42.6, 27: 43.0, 28: 43.4, 29: 43.8, 30: 44.2
    }
  },
  // التركيز الفعلي 30% عند 20°C
  {
    actualConcentration: 30,
    measuredAtTemperatures: {
      15: 28.1, 16: 28.5, 17: 28.9, 18: 29.2, 19: 29.6, 20: 30.0,
      21: 30.5, 22: 30.9, 23: 31.4, 24: 31.8, 25: 32.3, 26: 32.7, 27: 33.1, 28: 33.5, 29: 33.9, 30: 34.3
    }
  }
];

function findActualAlcoholFromMeasured(measuredAlcohol: number, temperature: number): number {
  if (temperature === 20) {
    return measuredAlcohol; // لا حاجة للتصحيح عند درجة الحرارة المرجعية
  }

  // البحث عن تطابق دقيق أولاً
  for (const entry of OFFICIAL_OIML_TABLE) {
    const measuredAtTemp = entry.measuredAtTemperatures[temperature];
    if (measuredAtTemp && Math.abs(measuredAtTemp - measuredAlcohol) < 0.05) {
      return entry.actualConcentration;
    }
  }

  // الاستيفاء بين أقرب قيمتين
  let lowerEntry: OfficialTableEntry | null = null;
  let upperEntry: OfficialTableEntry | null = null;

  const sortedEntries = [...OFFICIAL_OIML_TABLE].sort((a, b) => a.actualConcentration - b.actualConcentration);

  for (let i = 0; i < sortedEntries.length - 1; i++) {
    const current = sortedEntries[i];
    const next = sortedEntries[i + 1];
    
    const currentMeasured = current.measuredAtTemperatures[temperature];
    const nextMeasured = next.measuredAtTemperatures[temperature];
    
    if (currentMeasured && nextMeasured) {
      if (measuredAlcohol >= currentMeasured && measuredAlcohol <= nextMeasured) {
        lowerEntry = current;
        upperEntry = next;
        break;
      }
    }
  }

  if (!lowerEntry || !upperEntry) {
    // استخدام أقرب قيمة متاحة
    let closestEntry = OFFICIAL_OIML_TABLE[0];
    let minDiff = Math.abs(OFFICIAL_OIML_TABLE[0].actualConcentration - measuredAlcohol);
    
    for (const entry of OFFICIAL_OIML_TABLE) {
      const diff = Math.abs(entry.actualConcentration - measuredAlcohol);
      if (diff < minDiff) {
        minDiff = diff;
        closestEntry = entry;
      }
    }
    
    // حساب التصحيح من أقرب قيمة
    const measuredAtTemp = closestEntry.measuredAtTemperatures[temperature];
    const actualAt20 = closestEntry.actualConcentration;
    
    if (measuredAtTemp) {
      const correctionFactor = (actualAt20 - measuredAtTemp) / measuredAtTemp;
      return measuredAlcohol * (1 + correctionFactor);
    }
    
    return measuredAlcohol;
  }

  // الاستيفاء الخطي
  const lowerMeasured = lowerEntry.measuredAtTemperatures[temperature]!;
  const upperMeasured = upperEntry.measuredAtTemperatures[temperature]!;
  
  const ratio = (measuredAlcohol - lowerMeasured) / (upperMeasured - lowerMeasured);
  const actualValue = lowerEntry.actualConcentration + 
    ratio * (upperEntry.actualConcentration - lowerEntry.actualConcentration);
  
  return actualValue;
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
