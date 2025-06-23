import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, FlaskConical, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConcentrationResult {
  addedVolume: number;
  finalVolume: number;
  addedAlcoholPure: number;
  finalAlcoholPure: number;
}

export default function AlcoholConcentrationCalculator() {
  const [initialVolume, setInitialVolume] = useState("");
  const [initialConcentration, setInitialConcentration] = useState("");
  const [addingConcentration, setAddingConcentration] = useState("");
  const [targetConcentration, setTargetConcentration] = useState("");
  const [result, setResult] = useState<ConcentrationResult | null>(null);
  const { toast } = useToast();

  const calculateConcentration = () => {
    const V1 = parseFloat(initialVolume);
    const C1 = parseFloat(initialConcentration);
    const C2 = parseFloat(addingConcentration);
    const Cf = parseFloat(targetConcentration);

    if (!V1 || !C1 || !C2 || !Cf) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع القيم",
        variant: "destructive",
      });
      return;
    }

    if (C1 >= Cf) {
      toast({
        title: "خطأ",
        description: "التركيز المطلوب يجب أن يكون أعلى من التركيز الحالي",
        variant: "destructive",
      });
      return;
    }

    if (C2 <= Cf) {
      toast({
        title: "خطأ",
        description: "تركيز الكحول المضاف يجب أن يكون أعلى من التركيز المطلوب",
        variant: "destructive",
      });
      return;
    }

    // حساب الكحول النقي الحالي
    const currentPureAlcohol = (V1 * C1) / 100;

    // المعادلة: (V1 * C1 + V2 * C2) / (V1 + V2) = Cf
    // حل للمجهول V2
    // V1 * C1 + V2 * C2 = Cf * (V1 + V2)
    // V1 * C1 + V2 * C2 = Cf * V1 + Cf * V2
    // V2 * C2 - Cf * V2 = Cf * V1 - V1 * C1
    // V2 * (C2 - Cf) = V1 * (Cf - C1)
    // V2 = V1 * (Cf - C1) / (C2 - Cf)

    const V2 = (V1 * (Cf - C1)) / (C2 - Cf);
    const finalVolume = V1 + V2;
    const addedPureAlcohol = (V2 * C2) / 100;
    const finalPureAlcohol = currentPureAlcohol + addedPureAlcohol;

    setResult({
      addedVolume: Math.round(V2 * 100) / 100,
      finalVolume: Math.round(finalVolume * 100) / 100,
      addedAlcoholPure: Math.round(addedPureAlcohol * 100) / 100,
      finalAlcoholPure: Math.round(finalPureAlcohol * 100) / 100,
    });
  };

  const clearAll = () => {
    setInitialVolume("");
    setInitialConcentration("");
    setAddingConcentration("");
    setTargetConcentration("");
    setResult(null);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          حاسبة رفع تركيز الكحول
        </CardTitle>
        <p className="text-sm text-gray-600">
          حساب كمية الكحول المطلوب إضافتها لرفع التركيز
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="initial-volume" className="text-sm font-medium">
              الكمية الحالية في التانك (هيكتوليتر)
            </Label>
            <Input
              id="initial-volume"
              type="number"
              min="0"
              step="0.1"
              value={initialVolume}
              onChange={(e) => setInitialVolume(e.target.value)}
              placeholder="مثال: 60"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="initial-concentration" className="text-sm font-medium">
              التركيز الحالي %
            </Label>
            <Input
              id="initial-concentration"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={initialConcentration}
              onChange={(e) => setInitialConcentration(e.target.value)}
              placeholder="مثال: 38"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="adding-concentration" className="text-sm font-medium">
              تركيز الكحول المضاف %
            </Label>
            <Input
              id="adding-concentration"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={addingConcentration}
              onChange={(e) => setAddingConcentration(e.target.value)}
              placeholder="مثال: 55"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="target-concentration" className="text-sm font-medium">
              التركيز المطلوب %
            </Label>
            <Input
              id="target-concentration"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={targetConcentration}
              onChange={(e) => setTargetConcentration(e.target.value)}
              placeholder="مثال: 40"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={calculateConcentration} 
            className="flex-1"
            size="lg"
          >
            <Calculator className="mr-2 h-4 w-4" />
            احسب الكمية المطلوبة
          </Button>
          
          <Button 
            onClick={clearAll} 
            variant="outline"
            size="lg"
          >
            مسح الكل
          </Button>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              نتائج الحساب
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-sm text-gray-600">كمية الكحول المطلوب إضافتها</p>
                <p className="text-xl font-bold text-green-800">
                  {result.addedVolume} هيكتوليتر
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-sm text-gray-600">الكمية النهائية في التانك</p>
                <p className="text-xl font-bold text-green-800">
                  {result.finalVolume} هيكتوليتر
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-sm text-gray-600">كمية الكحول النقي المضاف</p>
                <p className="text-lg font-bold text-green-700">
                  {result.addedAlcoholPure} هيكتوليتر
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-sm text-gray-600">إجمالي الكحول النقي النهائي</p>
                <p className="text-lg font-bold text-green-700">
                  {result.finalAlcoholPure} هيكتوليتر
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>ملخص العملية:</strong> بإضافة {result.addedVolume} هيكتوليتر من الكحول بتركيز {addingConcentration}% 
                إلى {initialVolume} هيكتوليتر بتركيز {initialConcentration}%، 
                ستحصل على {result.finalVolume} هيكتوليتر بتركيز {targetConcentration}%.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}