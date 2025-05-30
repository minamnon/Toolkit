import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit2, Calendar, Beaker } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MixingCalculation } from "@shared/schema";

interface SavedMixingCalculationsProps {
  onLoadCalculation: (calculation: MixingCalculation) => void;
}

export default function SavedMixingCalculations({ onLoadCalculation }: SavedMixingCalculationsProps) {
  const [editingCalculation, setEditingCalculation] = useState<MixingCalculation | null>(null);
  const [newName, setNewName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: calculations = [], isLoading } = useQuery<MixingCalculation[]>({
    queryKey: ["/api/mixing-calculations"],
  });

  const deleteCalculationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/mixing-calculations/${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mixing-calculations"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الحساب بنجاح",
      });
    },
  });

  const updateCalculationMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await apiRequest(`/api/mixing-calculations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mixing-calculations"] });
      setEditingCalculation(null);
      setNewName("");
      toast({
        title: "تم التحديث",
        description: "تم تحديث اسم الحساب بنجاح",
      });
    },
  });

  const handleEdit = (calculation: MixingCalculation) => {
    setEditingCalculation(calculation);
    setNewName(calculation.name);
  };

  const handleSaveEdit = () => {
    if (editingCalculation && newName.trim()) {
      updateCalculationMutation.mutate({
        id: editingCalculation.id,
        name: newName.trim(),
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">جاري تحميل الحسابات المحفوظة...</div>
        </CardContent>
      </Card>
    );
  }

  if (calculations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">الحسابات المحفوظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            لا توجد حسابات محفوظة بعد
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          الحسابات المحفوظة ({calculations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {calculations.map((calculation) => {
          const components = JSON.parse(calculation.components);
          
          return (
            <div key={calculation.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-right">{calculation.name}</h4>
                  <div className="text-sm text-gray-600 text-right mt-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span>{calculation.timestamp}</span>
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(calculation)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCalculationMutation.mutate(calculation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm space-y-1 mb-3">
                <div className="text-right">
                  <strong>النتيجة:</strong> {parseFloat(calculation.finalVolume).toFixed(3)} هيكتوليتر ({(parseFloat(calculation.finalVolume) * 100).toFixed(0)} لتر) - {parseFloat(calculation.finalAlcoholContent).toFixed(2)}%
                </div>
                <div className="text-right">
                  <strong>عدد المكونات:</strong> {components.length}
                </div>
              </div>
              
              <Button
                variant="default"
                size="sm"
                onClick={() => onLoadCalculation(calculation)}
                className="w-full"
              >
                تحميل هذا الحساب
              </Button>
            </div>
          );
        })}

        {/* Dialog for editing calculation name */}
        <Dialog open={!!editingCalculation} onOpenChange={() => setEditingCalculation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-right">تعديل اسم الحساب</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newName" className="text-right block">الاسم الجديد</Label>
                <Input
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1"
                  placeholder="أدخل الاسم الجديد"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingCalculation(null)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveEdit} disabled={!newName.trim()}>
                  حفظ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}