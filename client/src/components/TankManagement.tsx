import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Drum, Calculator, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TankManagement() {
  const [st1Cm, setSt1Cm] = useState("");
  const [st1Total, setSt1Total] = useState("");
  const [st2Cm, setSt2Cm] = useState("");
  const [st2Total, setSt2Total] = useState("");
  const [fwSections, setFwSections] = useState("");
  const [fwTotal, setFwTotal] = useState("");
  
  // Dilution calculator states
  const [originalConcentration, setOriginalConcentration] = useState("");
  const [targetConcentration, setTargetConcentration] = useState("");
  const [targetSections, setTargetSections] = useState("");
  const [dilutionResult, setDilutionResult] = useState<{
    volumeNeeded: number;
    waterNeeded: number;
  } | null>(null);
  
  const { toast } = useToast();

  const calculateST1 = () => {
    const cm = parseFloat(st1Cm);
    if (!cm) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عدد السنتيمترات",
        variant: "destructive",
      });
      return;
    }
    const totalLiters = (cm * 28.5) + 605;
    const totalHectoliters = totalLiters / 100;
    setSt1Total(totalHectoliters.toFixed(3));
  };

  const calculateST2 = () => {
    const cm = parseFloat(st2Cm);
    if (!cm) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عدد السنتيمترات",
        variant: "destructive",
      });
      return;
    }
    const totalLiters = (cm * 20.4) + 305;
    const totalHectoliters = totalLiters / 100;
    setSt2Total(totalHectoliters.toFixed(3));
  };

  const calculateFW = () => {
    const sections = parseFloat(fwSections);
    if (!sections) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عدد البايكات",
        variant: "destructive",
      });
      return;
    }
    if (sections > 13) {
      toast({
        title: "خطأ",
        description: "عدد البايكات لا يمكن أن يتجاوز 13",
        variant: "destructive",
      });
      return;
    }
    const totalLiters = sections * 550;
    const totalHectoliters = totalLiters / 100;
    setFwTotal(totalHectoliters.toFixed(3));
  };

  const calculateDilution = () => {
    const originalConc = parseFloat(originalConcentration);
    const targetConc = parseFloat(targetConcentration);
    const targetSec = parseFloat(targetSections);

    if (!originalConc || !targetConc || !targetSec) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع القيم المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (targetConc >= originalConc) {
      toast({
        title: "خطأ",
        description: "التركيز المطلوب يجب أن يكون أقل من التركيز الأصلي",
        variant: "destructive",
      });
      return;
    }

    // Calculate volume needed from original concentration
    const targetVolumeLiters = targetSec * 550; // Total volume needed in liters
    const targetVolumeHectoliters = targetVolumeLiters / 100;
    
    // Using dilution formula: C1 * V1 = C2 * V2
    // V1 = (C2 * V2) / C1
    const volumeNeededLiters = (targetConc * targetVolumeLiters) / originalConc;
    const volumeNeededHectoliters = volumeNeededLiters / 100;
    
    // Water needed = Total volume - Original volume
    const waterNeededLiters = targetVolumeLiters - volumeNeededLiters;
    const waterNeededHectoliters = waterNeededLiters / 100;

    setDilutionResult({
      volumeNeeded: volumeNeededHectoliters,
      waterNeeded: waterNeededHectoliters
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Drum className="h-6 w-6" />
          إدارة التانكات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ST1 Tank */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-secondary">تانك ST1</h3>
          <p className="text-sm text-muted-foreground mb-3">
            كل 1 سم = 28.5 لتر، الكيرف = 605 لتر
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="st1-cm" className="text-sm font-medium">
                عدد السنتيمترات
              </Label>
              <Input
                id="st1-cm"
                type="number"
                value={st1Cm}
                onChange={(e) => setSt1Cm(e.target.value)}
                placeholder="مثال: 50"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="st1-total" className="text-sm font-medium">
                الحجم الكلي (هيكتوليتر)
              </Label>
              <Input
                id="st1-total"
                type="number"
                value={st1Total}
                readOnly
                className="mt-1 bg-muted"
              />
              {st1Total && (
                <div className="text-xs text-muted-foreground mt-1">
                  ({(parseFloat(st1Total) * 100).toFixed(0)} لتر)
                </div>
              )}
            </div>
          </div>
          <Button onClick={calculateST1} className="mt-3 w-full" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            احسب الحجم
          </Button>
        </div>

        {/* ST2 Tank */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-secondary">تانك ST2</h3>
          <p className="text-sm text-muted-foreground mb-3">
            كل 1 سم = 20.4 لتر، الكيرف = 305 لتر
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="st2-cm" className="text-sm font-medium">
                عدد السنتيمترات
              </Label>
              <Input
                id="st2-cm"
                type="number"
                value={st2Cm}
                onChange={(e) => setSt2Cm(e.target.value)}
                placeholder="مثال: 30"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="st2-total" className="text-sm font-medium">
                الحجم الكلي (هيكتوليتر)
              </Label>
              <Input
                id="st2-total"
                type="number"
                value={st2Total}
                readOnly
                className="mt-1 bg-muted"
              />
              {st2Total && (
                <div className="text-xs text-muted-foreground mt-1">
                  ({(parseFloat(st2Total) * 100).toFixed(0)} لتر)
                </div>
              )}
            </div>
          </div>
          <Button onClick={calculateST2} className="mt-3 w-full" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            احسب الحجم
          </Button>
        </div>

        {/* FW Tank */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-secondary">
            تانك FW (Fermented Wash)
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            13 بايكة، كل بايكة = 550 لتر
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fw-sections" className="text-sm font-medium">
                عدد البايكات
              </Label>
              <Input
                id="fw-sections"
                type="number"
                max="13"
                value={fwSections}
                onChange={(e) => setFwSections(e.target.value)}
                placeholder="مثال: 8"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fw-total" className="text-sm font-medium">
                الحجم الكلي (هيكتوليتر)
              </Label>
              <Input
                id="fw-total"
                type="number"
                value={fwTotal}
                readOnly
                className="mt-1 bg-muted"
              />
              {fwTotal && (
                <div className="text-xs text-muted-foreground mt-1">
                  ({(parseFloat(fwTotal) * 100).toFixed(0)} لتر)
                </div>
              )}
            </div>
          </div>
          <Button onClick={calculateFW} className="mt-3 w-full" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            احسب الحجم
          </Button>
        </div>

        {/* Dilution Calculator Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            حاسبة تخفيف الكحول
          </h3>
          <p className="text-sm text-blue-600 mb-3">
            حساب الكمية المطلوبة لتحضير عدد بايكات محدد بتركيز معين
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="original-concentration" className="text-sm font-medium">
                التركيز الأصلي %
              </Label>
              <Input
                id="original-concentration"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={originalConcentration}
                onChange={(e) => setOriginalConcentration(e.target.value)}
                placeholder="مثال: 50"
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
                placeholder="مثال: 10"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="target-sections" className="text-sm font-medium">
                عدد البايكات المطلوب
              </Label>
              <Input
                id="target-sections"
                type="number"
                min="1"
                max="13"
                value={targetSections}
                onChange={(e) => setTargetSections(e.target.value)}
                placeholder="مثال: 5"
                className="mt-1"
              />
            </div>
          </div>

          <Button onClick={calculateDilution} className="w-full mb-4" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            احسب كمية التخفيف
          </Button>

          {dilutionResult && (
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">نتيجة التخفيف:</h4>
              <div className="grid grid-cols-2 gap-4 text-blue-700">
                <div>
                  <span className="text-sm">كمية الكحول المطلوبة:</span>
                  <div className="font-bold">{dilutionResult.volumeNeeded.toFixed(3)} هيكتوليتر</div>
                  <div className="text-xs text-blue-600">({(dilutionResult.volumeNeeded * 100).toFixed(0)} لتر)</div>
                </div>
                <div>
                  <span className="text-sm">كمية الماء المطلوبة:</span>
                  <div className="font-bold">{dilutionResult.waterNeeded.toFixed(3)} هيكتوليتر</div>
                  <div className="text-xs text-blue-600">({(dilutionResult.waterNeeded * 100).toFixed(0)} لتر)</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-blue-600">
                إجمالي الكمية النهائية: {parseFloat(targetSections) * 5.5} هيكتوليتر ({parseFloat(targetSections) * 550} لتر)
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
