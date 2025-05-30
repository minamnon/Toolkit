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
  const [result, setResult] = useState<{ waterNeeded: number; finalVolume: number } | null>(null);
  const { toast } = useToast();

  const calculateDilution = () => {
    const concentration1 = parseFloat(c1);
    const volume1 = parseFloat(v1);
    const concentration2 = parseFloat(c2);

    if (!concentration1 || !volume1 || !concentration2) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع القيم",
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

    const waterNeeded = (volume1 * (concentration1 - concentration2)) / concentration2;
    const finalVolume = volume1 + waterNeeded;

    setResult({ waterNeeded, finalVolume });
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
          <Label htmlFor="v1" className="text-sm font-medium">
            الحجم الأصلي (V1) لتر
          </Label>
          <Input
            id="v1"
            type="number"
            value={v1}
            onChange={(e) => setV1(e.target.value)}
            placeholder="مثال: 1000"
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
            <p className="text-green-700">
              كمية الماء المطلوبة: {result.waterNeeded.toFixed(2)} لتر
            </p>
            <p className="text-green-700">
              الحجم النهائي: {result.finalVolume.toFixed(2)} لتر
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
