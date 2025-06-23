import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskRound, Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DilutionCalculator() {
  // التخفيف (تقليل التركيز)
  const [c1, setC1] = useState("");
  const [v1, setV1] = useState("");
  const [c2, setC2] = useState("");
  const [finalVolumeTarget, setFinalVolumeTarget] = useState("");
  const [calculationMode, setCalculationMode] = useState<"byOriginalVolume" | "byFinalVolume">("byOriginalVolume");
  const [result, setResult] = useState<{ waterNeeded: number; finalVolume: number; alcoholNeeded?: number } | null>(null);
  
  // رفع التركيز
  const [concInitialVolume, setConcInitialVolume] = useState("");
  const [concInitialConcentration, setConcInitialConcentration] = useState("");
  const [concAddingConcentration, setConcAddingConcentration] = useState("");
  const [concTargetConcentration, setConcTargetConcentration] = useState("");
  const [concResult, setConcResult] = useState<{
    addedVolume: number;
    finalVolume: number;
    addedAlcoholPure: number;
    finalAlcoholPure: number;
  } | null>(null);
  
  const { toast } = useToast();

  const calculateConcentration = () => {
    const V1 = parseFloat(concInitialVolume);
    const C1 = parseFloat(concInitialConcentration);
    const C2 = parseFloat(concAddingConcentration);
    const Cf = parseFloat(concTargetConcentration);

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

    // حساب الكمية المطلوبة: V2 = V1 * (Cf - C1) / (C2 - Cf)
    const V2 = (V1 * (Cf - C1)) / (C2 - Cf);
    const finalVolume = V1 + V2;
    const addedPureAlcohol = (V2 * C2) / 100;
    const finalPureAlcohol = currentPureAlcohol + addedPureAlcohol;

    setConcResult({
      addedVolume: Math.round(V2 * 100) / 100,
      finalVolume: Math.round(finalVolume * 100) / 100,
      addedAlcoholPure: Math.round(addedPureAlcohol * 100) / 100,
      finalAlcoholPure: Math.round(finalPureAlcohol * 100) / 100,
    });
  };

  const calculateDilution = () => {
    const concentration1 = parseFloat(c1);
    const concentration2 = parseFloat(c2);

    if (!concentration1 || !concentration2) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال التركيزات",
        variant: "destructive",
      });
      return;
    }

    if (concentration2 >= concentration1) {
      toast({
        title: "خطأ",
        description: "التركيز المطلوب يجب أن يكون أقل من التركيز الأصلي",
        variant: "destructive",
      });
      return;
    }

    if (calculationMode === "byOriginalVolume") {
      const volume1 = parseFloat(v1);
      if (!volume1) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال الحجم الأصلي",
          variant: "destructive",
        });
        return;
      }

      // V1 * C1 = V2 * C2
      // V2 = (V1 * C1) / C2
      const finalVolume = (volume1 * concentration1) / concentration2;
      const waterNeeded = finalVolume - volume1;

      setResult({ waterNeeded, finalVolume });
    } else {
      const finalVolume = parseFloat(finalVolumeTarget);
      if (!finalVolume) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال الحجم النهائي المطلوب",
          variant: "destructive",
        });
        return;
      }

      // Using C1 * V1 = C2 * V2
      // V1 = (C2 * V2) / C1
      const alcoholNeeded = (concentration2 * finalVolume) / concentration1;
      const waterNeeded = finalVolume - alcoholNeeded;

      setResult({ waterNeeded, finalVolume, alcoholNeeded });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <FlaskRound className="h-6 w-6" />
          حسابات الكحول
        </CardTitle>
        <p className="text-sm text-gray-600">
          حسابات التخفيف ورفع التركيز
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="dilution" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dilution" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              تخفيف التركيز
            </TabsTrigger>
            <TabsTrigger value="concentration" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              رفع التركيز
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dilution" className="space-y-4">
            {/* Mode Selection */}
            <div className="bg-muted p-3 rounded-lg">
              <Label className="text-sm font-medium mb-2 block">نوع الحساب:</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="calculationMode"
                    checked={calculationMode === "byOriginalVolume"}
                    onChange={() => setCalculationMode("byOriginalVolume")}
                    className="text-primary"
                  />
                  <span className="text-sm">من الحجم الأصلي</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="calculationMode"
                    checked={calculationMode === "byFinalVolume"}
                    onChange={() => setCalculationMode("byFinalVolume")}
                    className="text-primary"
                  />
                  <span className="text-sm">من الحجم النهائي المطلوب</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="c1" className="text-sm font-medium">
                  التركيز الأصلي (C1) %
                </Label>
                <Input
                  id="c1"
                  type="number"
                  value={c1}
                  onChange={(e) => setC1(e.target.value)}
                  placeholder="مثال: 85"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="c2" className="text-sm font-medium">
                  التركيز المطلوب (C2) %
                </Label>
                <Input
                  id="c2"
                  type="number"
                  value={c2}
                  onChange={(e) => setC2(e.target.value)}
                  placeholder="مثال: 40"
                  className="mt-1"
                />
              </div>

              {calculationMode === "byOriginalVolume" ? (
                <div>
                  <Label htmlFor="v1" className="text-sm font-medium">
                    الحجم الأصلي (V1) - هيكتوليتر
                  </Label>
                  <Input
                    id="v1"
                    type="number"
                    value={v1}
                    onChange={(e) => setV1(e.target.value)}
                    placeholder="مثال: 10"
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="final-volume" className="text-sm font-medium">
                    الحجم النهائي المطلوب - هيكتوليتر
                  </Label>
                  <Input
                    id="final-volume"
                    type="number"
                    value={finalVolumeTarget}
                    onChange={(e) => setFinalVolumeTarget(e.target.value)}
                    placeholder="مثال: 20"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={calculateDilution} 
              className="w-full"
              size="lg"
            >
              <Calculator className="mr-2 h-4 w-4" />
              احسب التخفيف
            </Button>

            {result && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-blue-800 mb-2">النتيجة:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <span className="text-blue-700 font-medium">الماء المطلوب:</span>
                    <div className="text-blue-800 font-bold">{result.waterNeeded.toFixed(3)} هيكتوليتر</div>
                    <div className="text-blue-600 text-sm">({(result.waterNeeded * 100).toFixed(0)} لتر)</div>
                  </div>
                  {result.alcoholNeeded && (
                    <div className="text-center">
                      <span className="text-blue-700 font-medium">الكحول المطلوب:</span>
                      <div className="text-blue-800 font-bold">{result.alcoholNeeded.toFixed(3)} هيكتوليتر</div>
                      <div className="text-blue-600 text-sm">({(result.alcoholNeeded * 100).toFixed(0)} لتر)</div>
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-green-700 font-medium">الحجم النهائي:</span>
                    <div className="text-green-800 font-bold">{result.finalVolume.toFixed(3)} هيكتوليتر</div>
                    <div className="text-green-600 text-sm">({(result.finalVolume * 100).toFixed(0)} لتر)</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="concentration" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="conc-initial-volume" className="text-sm font-medium">
                  الكمية الحالية في التانك (هيكتوليتر)
                </Label>
                <Input
                  id="conc-initial-volume"
                  type="number"
                  min="0"
                  step="0.1"
                  value={concInitialVolume}
                  onChange={(e) => setConcInitialVolume(e.target.value)}
                  placeholder="مثال: 60"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="conc-initial-concentration" className="text-sm font-medium">
                  التركيز الحالي %
                </Label>
                <Input
                  id="conc-initial-concentration"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={concInitialConcentration}
                  onChange={(e) => setConcInitialConcentration(e.target.value)}
                  placeholder="مثال: 38"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="conc-adding-concentration" className="text-sm font-medium">
                  تركيز الكحول المضاف %
                </Label>
                <Input
                  id="conc-adding-concentration"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={concAddingConcentration}
                  onChange={(e) => setConcAddingConcentration(e.target.value)}
                  placeholder="مثال: 55"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="conc-target-concentration" className="text-sm font-medium">
                  التركيز المطلوب %
                </Label>
                <Input
                  id="conc-target-concentration"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={concTargetConcentration}
                  onChange={(e) => setConcTargetConcentration(e.target.value)}
                  placeholder="مثال: 40"
                  className="mt-1"
                />
              </div>
            </div>

            <Button 
              onClick={calculateConcentration} 
              className="w-full"
              size="lg"
            >
              <Calculator className="mr-2 h-4 w-4" />
              احسب الكمية المطلوبة
            </Button>

            {concResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  نتائج الحساب
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-sm text-gray-600">كمية الكحول المطلوب إضافتها</p>
                    <p className="text-xl font-bold text-green-800">
                      {concResult.addedVolume} هيكتوليتر
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-sm text-gray-600">الكمية النهائية في التانك</p>
                    <p className="text-xl font-bold text-green-800">
                      {concResult.finalVolume} هيكتوليتر
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-sm text-gray-600">كمية الكحول النقي المضاف</p>
                    <p className="text-lg font-bold text-green-700">
                      {concResult.addedAlcoholPure} هيكتوليتر
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-sm text-gray-600">إجمالي الكحول النقي النهائي</p>
                    <p className="text-lg font-bold text-green-700">
                      {concResult.finalAlcoholPure} هيكتوليتر
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>ملخص العملية:</strong> بإضافة {concResult.addedVolume} هيكتوليتر من الكحول بتركيز {concAddingConcentration}% 
                    إلى {concInitialVolume} هيكتوليتر بتركيز {concInitialConcentration}%، 
                    ستحصل على {concResult.finalVolume} هيكتوليتر بتركيز {concTargetConcentration}%.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}