import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FlaskRound, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DilutionCalculator() {
  const [c1, setC1] = useState("");
  const [v1, setV1] = useState("");
  const [c2, setC2] = useState("");
  const [finalVolumeTarget, setFinalVolumeTarget] = useState("");
  const [calculationMode, setCalculationMode] = useState<"byOriginalVolume" | "byFinalVolume">("byOriginalVolume");
  const [result, setResult] = useState<{ waterNeeded: number; finalVolume: number; alcoholNeeded?: number } | null>(null);
  const { toast } = useToast();

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

      const waterNeeded = (volume1 * (concentration1 - concentration2)) / concentration2;
      const finalVolume = volume1 + waterNeeded;

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
          حساب التخفيف
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        </div>

        {calculationMode === "byOriginalVolume" ? (
          <div>
            <Label htmlFor="v1" className="text-sm font-medium">
              الحجم الأصلي (V1) هيكتوليتر
            </Label>
            <Input
              id="v1"
              type="number"
              step="0.001"
              value={v1}
              onChange={(e) => setV1(e.target.value)}
              placeholder="مثال: 10"
              className="mt-1"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="final-volume" className="text-sm font-medium">
              الحجم النهائي المطلوب هيكتوليتر
            </Label>
            <Input
              id="final-volume"
              type="number"
              step="0.001"
              value={finalVolumeTarget}
              onChange={(e) => setFinalVolumeTarget(e.target.value)}
              placeholder="مثال: 15"
              className="mt-1"
            />
          </div>
        )}

        <Button 
          onClick={calculateDilution} 
          className="w-full"
          size="lg"
        >
          <Calculator className="mr-2 h-4 w-4" />
          احسب كمية الماء المطلوبة
        </Button>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-green-800 mb-2">النتيجة:</h3>
            <div className="grid grid-cols-1 gap-3">
              {result.alcoholNeeded && (
                <div>
                  <span className="text-green-700 font-medium">كمية الكحول المطلوبة:</span>
                  <div className="text-green-800 font-bold">{result.alcoholNeeded.toFixed(3)} هيكتوليتر</div>
                  <div className="text-green-600 text-sm">({(result.alcoholNeeded * 100).toFixed(0)} لتر)</div>
                </div>
              )}
              <div>
                <span className="text-green-700 font-medium">كمية الماء المطلوبة:</span>
                <div className="text-green-800 font-bold">{result.waterNeeded.toFixed(3)} هيكتوليتر</div>
                <div className="text-green-600 text-sm">({(result.waterNeeded * 100).toFixed(0)} لتر)</div>
              </div>
              <div>
                <span className="text-green-700 font-medium">الحجم النهائي:</span>
                <div className="text-green-800 font-bold">{result.finalVolume.toFixed(3)} هيكتوليتر</div>
                <div className="text-green-600 text-sm">({(result.finalVolume * 100).toFixed(0)} لتر)</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
