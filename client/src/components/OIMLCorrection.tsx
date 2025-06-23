import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Thermometer, Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOIMLCorrection, getTemperatureCorrectedAlcohol } from "@/lib/oiml";

export default function OIMLCorrection() {
  const [measuredAlcohol, setMeasuredAlcohol] = useState("");
  const [temperature, setTemperature] = useState("");
  const [results, setResults] = useState<{
    correction: number;
    correctedAlcohol: number;
    measuredValue: number;
    temperatureUsed: number;
  } | null>(null);
  const { toast } = useToast();

  const calculateCorrection = () => {
    const alcohol = parseFloat(measuredAlcohol);
    const temp = parseFloat(temperature);

    if (!alcohol || !temp) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع القيم",
        variant: "destructive",
      });
      return;
    }

    if (alcohol < 1 || alcohol > 99) {
      toast({
        title: "خطأ",
        description: "تركيز الكحول يجب أن يكون بين 1% و 99%",
        variant: "destructive",
      });
      return;
    }

    if (temp < -10 || temp > 50) {
      toast({
        title: "تحذير",
        description: "درجة الحرارة خارج النطاق المعتاد (10-35°C)، النتائج قد تكون تقريبية",
        variant: "default",
      });
    }

    const correction = getOIMLCorrection(alcohol, temp);
    const correctedAlcohol = getTemperatureCorrectedAlcohol(alcohol, temp);
    
    setResults({
      correction,
      correctedAlcohol,
      measuredValue: alcohol,
      temperatureUsed: temp
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Thermometer className="h-6 w-6" />
          تصحيح OIML حسب درجة الحرارة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="measured-alcohol" className="text-sm font-medium">
            الكحول المقروء %
          </Label>
          <Input
            id="measured-alcohol"
            type="number"
            min="1"
            max="99"
            step="0.1"
            value={measuredAlcohol}
            onChange={(e) => setMeasuredAlcohol(e.target.value)}
            placeholder="مثال: 85.5"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="temperature" className="text-sm font-medium">
            درجة الحرارة °C
          </Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            max="50"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="مثال: 25.0"
            className="mt-1"
          />
        </div>

        <Button 
          onClick={calculateCorrection} 
          className="w-full"
          size="lg"
        >
          <Calculator className="mr-2 h-4 w-4" />
          احسب التركيز الحقيقي
        </Button>

        {results !== null && (
          <div className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                النتائج وفقاً لجداول OIML R22 الرسمية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">القراءة المقاسة</p>
                  <p className="text-lg font-bold text-gray-800">
                    {results.measuredValue.toFixed(2)}%
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">درجة الحرارة</p>
                  <p className="text-lg font-bold text-gray-800">
                    {results.temperatureUsed.toFixed(1)}°C
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">معامل التصحيح</p>
                  <p className={`text-lg font-bold ${results.correction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.correction >= 0 ? '+' : ''}{results.correction.toFixed(3)}%
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-600">التركيز الحقيقي عند 20°C</p>
                  <p className="text-xl font-bold text-green-800">
                    {results.correctedAlcohol.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  ملاحظة: الحسابات معتمدة على جداول OIML R22 الدولية للمنظمة الدولية للقياس القانوني.
                  درجة الحرارة المرجعية المعتمدة هي 20°C.
                </p>
                {(results.temperatureUsed < 10 || results.temperatureUsed > 35) && (
                  <p className="text-xs text-orange-600 mt-1">
                    تنبيه: درجة الحرارة خارج النطاق المعتاد (10-35°C)، تم استخدام الاستقراء الخطي.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
