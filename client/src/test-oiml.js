
// تسج للتأكد من دقة الحسابات
import { getTemperatureCorrectedAlcohol } from './lib/oiml.js';

console.log('اختبار المثال المرجعي:');
console.log('97% عند 23°C =', getTemperatureCorrectedAlcohol(97, 23), '% عند 20°C');
console.log('96% عند 23°C =', getTemperatureCorrectedAlcohol(96, 23), '% عند 20°C');

