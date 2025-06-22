import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Save, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { exportToExcel } from "@/lib/export";
import type { DistillationOperation, InsertDistillationOperation } from "@shared/schema";

export default function DistillationLog() {
  const [formData, setFormData] = useState({
    operatorName: "",
    towerType: "",
    operationDate: new Date().toISOString().split('T')[0],
    operationTime: new Date().toTimeString().slice(0, 5),
    outputVolume: "",
    rawAlcohol: "",
    heads: "",
    tails: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    shift: "",
    date: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: operations = [], isLoading } = useQuery<DistillationOperation[]>({
    queryKey: ["/api/distillation-operations"],
  });

  const filteredOperations = useMemo(() => {
    return operations.filter((operation) => {
      const matchesShift = !searchFilters.shift || operation.towerType === searchFilters.shift;
      const matchesDate = !searchFilters.date || operation.operationDate === searchFilters.date;
      return matchesShift && matchesDate;
    });
  }, [operations, searchFilters]);

  const createOperationMutation = useMutation({
    mutationFn: async (data: InsertDistillationOperation) => {
      const response = await apiRequest("POST", "/api/distillation-operations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/distillation-operations"] });
      setFormData({
        operatorName: "",
        towerType: "",
        operationDate: new Date().toISOString().split('T')[0],
        operationTime: new Date().toTimeString().slice(0, 5),
        outputVolume: "",
        rawAlcohol: "",
        heads: "",
        tails: "",
      });
      toast({
        title: "نجح",
        description: "تم حفظ العملية بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ العملية",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.operatorName || !formData.towerType || !formData.outputVolume) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const operationData: InsertDistillationOperation = {
      ...formData,
      outputVolume: parseFloat(formData.outputVolume),
      rawAlcohol: formData.rawAlcohol ? parseFloat(formData.rawAlcohol) : null,
      heads: formData.heads ? parseFloat(formData.heads) : null,
      tails: formData.tails ? parseFloat(formData.tails) : null,
      timestamp: new Date().toLocaleString('ar-SA'),
    };

    createOperationMutation.mutate(operationData);
  };

  const handleExport = () => {
    exportToExcel(operations, "distillation_operations");
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          سجل عمليات التقطير
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operator-name" className="text-sm font-medium">
                اسم المشغل *
              </Label>
              <Input
                id="operator-name"
                value={formData.operatorName}
                onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tower-type" className="text-sm font-medium">
                الوردية *
              </Label>
              <Select
                value={formData.towerType}
                onValueChange={(value) => setFormData({ ...formData, towerType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر الوردية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shift-1">الوردية الأولى</SelectItem>
                  <SelectItem value="shift-2">الوردية الثانية</SelectItem>
                  <SelectItem value="shift-3">الوردية الثالثة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operation-date" className="text-sm font-medium">
                التاريخ
              </Label>
              <Input
                id="operation-date"
                type="date"
                value={formData.operationDate}
                onChange={(e) => setFormData({ ...formData, operationDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="operation-time" className="text-sm font-medium">
                الوقت
              </Label>
              <Input
                id="operation-time"
                type="time"
                value={formData.operationTime}
                onChange={(e) => setFormData({ ...formData, operationTime: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="output-volume" className="text-sm font-medium">
              كمية الناتج (هيكتوليتر) *
            </Label>
            <Input
              id="output-volume"
              type="number"
              step="0.001"
              value={formData.outputVolume}
              onChange={(e) => setFormData({ ...formData, outputVolume: e.target.value })}
              required
              className="mt-1"
              placeholder="مثال: 5.5"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="raw-alcohol" className="text-sm font-medium">
                كحول خام (هيكتوليتر)
              </Label>
              <Input
                id="raw-alcohol"
                type="number"
                step="0.001"
                value={formData.rawAlcohol}
                onChange={(e) => setFormData({ ...formData, rawAlcohol: e.target.value })}
                className="mt-1"
                placeholder="2.5"
              />
            </div>
            <div>
              <Label htmlFor="heads" className="text-sm font-medium">
                رؤوس (هيكتوليتر)
              </Label>
              <Input
                id="heads"
                type="number"
                step="0.001"
                value={formData.heads}
                onChange={(e) => setFormData({ ...formData, heads: e.target.value })}
                className="mt-1"
                placeholder="1.2"
              />
            </div>
            <div>
              <Label htmlFor="tails" className="text-sm font-medium">
                زيت (هيكتوليتر)
              </Label>
              <Input
                id="tails"
                type="number"
                step="0.001"
                value={formData.tails}
                onChange={(e) => setFormData({ ...formData, tails: e.target.value })}
                className="mt-1"
                placeholder="1.8"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={createOperationMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            حفظ العملية
          </Button>
        </form>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">العمليات المحفوظة</h3>
            <Button 
              onClick={handleExport}
              variant="outline"
              size="sm"
              disabled={operations.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              تصدير البيانات
            </Button>
          </div>

          {/* Search Filters */}
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">البحث والتصفية</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search-shift" className="text-sm">
                  الوردية
                </Label>
                <Select
                  value={searchFilters.shift}
                  onValueChange={(value) => setSearchFilters({ ...searchFilters, shift: value === "all" ? "" : value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="جميع الورديات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الورديات</SelectItem>
                    <SelectItem value="shift-1">الوردية الأولى</SelectItem>
                    <SelectItem value="shift-2">الوردية الثانية</SelectItem>
                    <SelectItem value="shift-3">الوردية الثالثة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="search-date" className="text-sm">
                  التاريخ
                </Label>
                <Input
                  id="search-date"
                  type="date"
                  value={searchFilters.date}
                  onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            {(searchFilters.shift || searchFilters.date) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchFilters({ shift: "", date: "" })}
                className="mt-3"
              >
                مسح التصفية
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground">جاري التحميل...</p>
            ) : filteredOperations.length === 0 ? (
              <p className="text-muted-foreground">
                {operations.length === 0 ? "لا توجد عمليات محفوظة" : "لا توجد نتائج مطابقة للبحث"}
              </p>
            ) : (
              filteredOperations.map((operation) => (
                <div key={operation.id} className="bg-muted p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">
                        {operation.operatorName} - {operation.towerType}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {operation.operationDate} {operation.operationTime} | {operation.outputVolume} هيكتوليتر
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        خام: {operation.rawAlcohol || 0}hl | رؤوس: {operation.heads || 0}hl | زيت: {operation.tails || 0}hl
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{operation.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
