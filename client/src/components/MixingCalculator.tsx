import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Calculator, Save, Download, Beaker } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { exportToExcel } from "@/lib/export";
import type { MixingCalculation, InsertMixingCalculation } from "@shared/schema";

interface MixingComponent {
  id: number;
  volume: string; // in hectoliters
  alcoholContent: string;
}

export default function MixingCalculator() {
  const [components, setComponents] = useState<MixingComponent[]>([
    { id: 1, volume: "", alcoholContent: "" },
    { id: 2, volume: "", alcoholContent: "" }
  ]);
  const [result, setResult] = useState<{ totalVolume: number; finalAlcoholContent: number } | null>(null);
  const [nextId, setNextId] = useState(3);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: calculations = [], isLoading } = useQuery<MixingCalculation[]>({
    queryKey: ["/api/mixing-calculations"],
  });

  const createCalculationMutation = useMutation({
    mutationFn: async (data: InsertMixingCalculation) => {
      const response = await apiRequest("POST", "/api/mixing-calculations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mixing-calculations"] });
      toast({
        title: "نجح",
        description: "تم حفظ عملية الدمج بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ عملية الدمج",
        variant: "destructive",
      });
    },
  });

  const addComponent = () => {
    setComponents([...components, { id: nextId, volume: "", alcoholContent: "" }]);
    setNextId(nextId + 1);
  };

  const removeComponent = (id: number) => {
    if (components.length > 2) {
      setComponents(components.filter(comp => comp.id !== id));
    }
  };

  const updateComponent = (id: number, field: keyof MixingComponent, value: string) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const calculateMixing = () => {
    console.log("المكونات المدخلة:", components);
    
    const validComponents = components.filter(comp => {
      const volume = comp.volume && comp.volume.trim() !== "";
      const alcohol = comp.alcoholContent && comp.alcoholContent.trim() !== "";
      const volumeNum = volume ? parseFloat(comp.volume) : 0;
      const alcoholNum = alcohol ? parseFloat(comp.alcoholContent) : 0;
      
      return volume && alcohol && volumeNum > 0 && alcoholNum >= 0;
    });

    console.log("المكونات الصحيحة:", validComponents);

    if (validComponents.length < 1) {
      toast({
        title: "خطأ",
        description: "يجب إدخال مكون واحد على الأقل بقيم صحيحة",
        variant: "destructive",
      });
      return;
    }

    let totalVolume = 0;
    let totalAlcoholVolume = 0;

    validComponents.forEach((comp, index) => {
      const volume = parseFloat(comp.volume);
      const alcoholContent = parseFloat(comp.alcoholContent);
      
      console.log(`المكون ${index + 1}: ${volume} هيكتوليتر × ${alcoholContent}%`);
      
      totalVolume += volume;
      totalAlcoholVolume += (volume * alcoholContent / 100);
    });

    console.log("إجمالي الحجم:", totalVolume);
    console.log("إجمالي حجم الكحول الصافي:", totalAlcoholVolume);

    const finalAlcoholContent = totalVolume > 0 ? (totalAlcoholVolume / totalVolume) * 100 : 0;

    console.log("التركيز النهائي:", finalAlcoholContent);

    setResult({
      totalVolume,
      finalAlcoholContent
    });

    toast({
      title: "تم الحساب بنجاح",
      description: `تم دمج ${validComponents.length} مكونات`,
    });
  };

  const saveCalculation = () => {
    if (!result) {
      toast({
        title: "خطأ",
        description: "يجب حساب النتيجة أولاً",
        variant: "destructive",
      });
      return;
    }

    const validComponents = components.filter(comp => 
      comp.volume && comp.alcoholContent && 
      parseFloat(comp.volume) > 0 && parseFloat(comp.alcoholContent) >= 0
    );

    const calculationData: InsertMixingCalculation = {
      components: JSON.stringify(validComponents),
      finalVolume: result.totalVolume,
      finalAlcoholContent: result.finalAlcoholContent,
      timestamp: new Date().toLocaleString('ar-SA'),
    };

    createCalculationMutation.mutate(calculationData);
  };

  const handleExport = () => {
    const exportData = calculations.map(calc => ({
      المكونات: JSON.parse(calc.components).map((comp: any) => 
        `${comp.volume}hl (${comp.alcoholContent}%)`).join(', '),
      الحجم_النهائي: `${calc.finalVolume} هيكتوليتر`,
      التركيز_النهائي: `${calc.finalAlcoholContent.toFixed(2)}%`,
      التاريخ: calc.timestamp
    }));
    exportToExcel(exportData, "mixing_calculations");
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Beaker className="h-6 w-6" />
          حاسبة دمج الكميات والتركيزات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">المكونات المراد دمجها</h3>
          
          {components.map((component, index) => (
            <div key={component.id} className="border rounded-lg p-4 bg-muted/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">المكون {index + 1}</span>
                {components.length > 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeComponent(component.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`volume-${component.id}`} className="text-sm font-medium">
                    الكمية (هيكتوليتر)
                  </Label>
                  <Input
                    id={`volume-${component.id}`}
                    type="number"
                    min="0"
                    step="0.1"
                    value={component.volume}
                    onChange={(e) => updateComponent(component.id, 'volume', e.target.value)}
                    placeholder="مثال: 5.5"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`alcohol-${component.id}`} className="text-sm font-medium">
                    التركيز %
                  </Label>
                  <Input
                    id={`alcohol-${component.id}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={component.alcoholContent}
                    onChange={(e) => updateComponent(component.id, 'alcoholContent', e.target.value)}
                    placeholder="مثال: 85.5"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addComponent}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            إضافة مكون جديد
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={calculateMixing} 
            className="flex-1"
            size="lg"
          >
            <Calculator className="mr-2 h-4 w-4" />
            احسب النتيجة النهائية
          </Button>
          
          {result && (
            <Button 
              onClick={saveCalculation}
              variant="outline"
              size="lg"
              disabled={createCalculationMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              حفظ
            </Button>
          )}
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-green-800 mb-2">النتيجة النهائية:</h3>
            <div className="grid grid-cols-2 gap-4 text-green-700">
              <div>
                <span className="text-sm">إجمالي الكمية:</span>
                <div className="text-xl font-bold">{result.totalVolume.toFixed(2)} هيكتوليتر</div>
                <div className="text-sm text-green-600">({(result.totalVolume * 100).toFixed(0)} لتر)</div>
              </div>
              <div>
                <span className="text-sm">التركيز النهائي:</span>
                <div className="text-xl font-bold">{result.finalAlcoholContent.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">عمليات الدمج المحفوظة</h3>
            <Button 
              onClick={handleExport}
              variant="outline"
              size="sm"
              disabled={calculations.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              تصدير البيانات
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground">جاري التحميل...</p>
            ) : calculations.length === 0 ? (
              <p className="text-muted-foreground">لا توجد عمليات دمج محفوظة</p>
            ) : (
              calculations.map((calculation) => {
                const components = JSON.parse(calculation.components);
                return (
                  <div key={calculation.id} className="bg-muted p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium mb-1">
                          {calculation.finalVolume.toFixed(2)} هيكتوليتر - {calculation.finalAlcoholContent.toFixed(2)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          المكونات: {components.map((comp: any, idx: number) => 
                            `${comp.volume}hl (${comp.alcoholContent}%)`
                          ).join(' + ')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {calculation.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}