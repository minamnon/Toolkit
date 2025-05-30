import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Thermometer, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOIMLCorrection } from "@/lib/oiml";

export default function OIMLCorrection() {
  const [measuredAlcohol, setMeasuredAlcohol] = useState("");
  const [temperature, setTemperature] = useState("");
  const [result, setResult] = useState<number | null>(null);
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

    const correction = getOIMLCorrection(alcohol, temp);
    const trueAlcohol = alcohol + correction;
    setResult(trueAlcohol);
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

        {result !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">النتيجة:</h3>
            <p className="text-blue-700">
              التركيز الحقيقي: {result.toFixed(2)}%
            </p>
            <p className="text-sm text-blue-600 mt-2">
              وفقاً لجداول OIML الدولية
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
