import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tags, Star, StarHalf, Download, SortAsc } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { exportToExcel } from "@/lib/export";
import type { ContainerClassification, InsertContainerClassification } from "@shared/schema";

export default function ContainerClassification() {
  const [alcoholContent, setAlcoholContent] = useState("");
  const [containerCount, setContainerCount] = useState("");
  const [currentClassification, setCurrentClassification] = useState<{
    grade1: number;
    grade2: number;
    alcohol: number;
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classifications = [], isLoading } = useQuery<ContainerClassification[]>({
    queryKey: ["/api/container-classifications"],
  });

  const createClassificationMutation = useMutation({
    mutationFn: async (data: InsertContainerClassification) => {
      const response = await apiRequest("POST", "/api/container-classifications", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/container-classifications"] });
      toast({
        title: "نجح",
        description: "تم حفظ التصنيف بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ التصنيف",
        variant: "destructive",
      });
    },
  });

  const classifyContainers = () => {
    const alcohol = parseFloat(alcoholContent);
    const count = parseInt(containerCount);

    if (!alcohol || !count) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع القيم",
        variant: "destructive",
      });
      return;
    }

    if (alcohol < 0 || alcohol > 100) {
      toast({
        title: "خطأ",
        description: "تركيز الكحول يجب أن يكون بين 0% و 100%",
        variant: "destructive",
      });
      return;
    }

    const classification = alcohol >= 70 ? "درجة أولى" : "درجة ثانية";
    
    const classificationData: InsertContainerClassification = {
      alcoholContent: alcohol,
      containerCount: count,
      classification,
      timestamp: new Date().toLocaleString('ar-SA'),
    };

    // Show current classification
    if (alcohol >= 70) {
      setCurrentClassification({ grade1: count, grade2: 0, alcohol });
    } else {
      setCurrentClassification({ grade1: 0, grade2: count, alcohol });
    }

    createClassificationMutation.mutate(classificationData);
  };

  const handleExport = () => {
    exportToExcel(classifications, "container_classifications");
  };

  // Calculate totals
  const totals = classifications.reduce(
    (acc, item) => {
      if (item.classification === "درجة أولى") {
        acc.grade1 += item.containerCount;
      } else {
        acc.grade2 += item.containerCount;
      }
      return acc;
    },
    { grade1: 0, grade2: 0 }
  );

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Tags className="h-6 w-6" />
          تصنيف الجراكن حسب التركيز
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="container-alcohol" className="text-sm font-medium">
            تركيز الكحول %
          </Label>
          <Input
            id="container-alcohol"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={alcoholContent}
            onChange={(e) => setAlcoholContent(e.target.value)}
            placeholder="مثال: 75.5"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="container-count" className="text-sm font-medium">
            عدد الجراكن
          </Label>
          <Input
            id="container-count"
            type="number"
            min="1"
            value={containerCount}
            onChange={(e) => setContainerCount(e.target.value)}
            placeholder="مثال: 10"
            className="mt-1"
          />
        </div>

        <Button 
          onClick={classifyContainers} 
          className="w-full"
          size="lg"
          disabled={createClassificationMutation.isPending}
        >
          <SortAsc className="mr-2 h-4 w-4" />
          صنف الجراكن
        </Button>

        {currentClassification && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                درجة أولى (≥ 70%)
              </h3>
              <div className="text-green-700">
                {currentClassification.grade1 > 0 
                  ? `${currentClassification.grade1} جركن بتركيز ${currentClassification.alcohol}%`
                  : "لا توجد جراكن في هذه الفئة"
                }
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <StarHalf className="h-4 w-4" />
                درجة ثانية (< 70%)
              </h3>
              <div className="text-yellow-700">
                {currentClassification.grade2 > 0 
                  ? `${currentClassification.grade2} جركن بتركيز ${currentClassification.alcohol}%`
                  : "لا توجد جراكن في هذه الفئة"
                }
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">الجراكن المصنفة</h3>
            <Button 
              onClick={handleExport}
              variant="outline"
              size="sm"
              disabled={classifications.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              تصدير التصنيف
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-800">{totals.grade1}</div>
              <div className="text-sm text-green-600">درجة أولى</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-800">{totals.grade2}</div>
              <div className="text-sm text-yellow-600">درجة ثانية</div>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground">جاري التحميل...</p>
            ) : classifications.length === 0 ? (
              <p className="text-muted-foreground">لا توجد جراكن مصنفة</p>
            ) : (
              classifications.map((item) => (
                <div key={item.id} className="bg-muted p-3 rounded border flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {item.containerCount} جركن - {item.alcoholContent}%
                    </span>
                    <span className="text-sm text-muted-foreground block">
                      {item.classification}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                  <span 
                    className={`text-sm px-2 py-1 rounded ${
                      item.classification === "درجة أولى" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.classification}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
