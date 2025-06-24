import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, Thermometer, Beaker, Info, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConversionItem {
  title: string;
  formula: string;
  example: string;
  tooltip: string;
  category: string;
}

interface TemperatureCorrection {
  temp: number;
  alcohol40: number;
  alcohol60: number;
  alcohol80: number;
  alcohol95: number;
}

export default function AlcoholCheatSheet() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const conversions: ConversionItem[] = [
    {
      title: "تخفيف التركيز",
      formula: "V2 = (V1 × C1) ÷ C2",
      example: "لتخفيف 10 هـ.ل من 80% إلى 40%: V2 = (10 × 80) ÷ 40 = 20 هـ.ل",
      tooltip: "V1 = الحجم الأصلي، C1 = التركيز الأصلي، V2 = الحجم النهائي، C2 = التركيز المطلوب",
      category: "dilution"
    },
    {
      title: "كمية الماء المطلوبة",
      formula: "الماء = V2 - V1",
      example: "الماء المطلوب = 20 - 10 = 10 هيكتوليتر",
      tooltip: "الماء المضاف = الحجم النهائي - الحجم الأصلي",
      category: "dilution"
    },
    {
      title: "رفع التركيز",
      formula: "V2 = V1 × (Cf - C1) ÷ (C2 - Cf)",
      example: "لرفع 60 هـ.ل من 38% إلى 40% بكحول 55%: V2 = 60 × (40-38) ÷ (55-40) = 8 هـ.ل",
      tooltip: "V2 = الكحول المضاف، Cf = التركيز المطلوب، C2 = تركيز الكحول المضاف",
      category: "concentration"
    },
    {
      title: "حساب الكحول النقي",
      formula: "الكحول النقي = الحجم × التركيز ÷ 100",
      example: "في 50 هـ.ل بتركيز 40%: الكحول النقي = 50 × 40 ÷ 100 = 20 هـ.ل",
      tooltip: "يحسب كمية الكحول الإيثيلي النقي في الخليط",
      category: "calculation"
    },
    {
      title: "التحويل من هيكتوليتر إلى لتر",
      formula: "اللترات = الهيكتوليتر × 100",
      example: "15 هيكتوليتر = 15 × 100 = 1500 لتر",
      tooltip: "1 هيكتوليتر = 100 لتر",
      category: "units"
    },
    {
      title: "التحويل من لتر إلى هيكتوليتر",
      formula: "الهيكتوليتر = اللترات ÷ 100",
      example: "2500 لتر = 2500 ÷ 100 = 25 هيكتوليتر",
      tooltip: "100 لتر = 1 هيكتوليتر",
      category: "units"
    },
    {
      title: "خلط تركيزين مختلفين",
      formula: "Cf = (V1×C1 + V2×C2) ÷ (V1+V2)",
      example: "خلط 30 هـ.ل (60%) + 20 هـ.ل (80%): Cf = (30×60 + 20×80) ÷ 50 = 68%",
      tooltip: "يحسب التركيز النهائي عند خلط حجمين بتركيزين مختلفين",
      category: "mixing"
    },
    {
      title: "حساب النسبة المئوية للفقد",
      formula: "الفقد% = (الحجم الأصلي - الحجم النهائي) ÷ الحجم الأصلي × 100",
      example: "فقد من 100 هـ.ل إلى 95 هـ.ل: (100-95) ÷ 100 × 100 = 5%",
      tooltip: "يحسب نسبة الفقد أثناء العمليات",
      category: "calculation"
    }
  ];

  const temperatureCorrections: TemperatureCorrection[] = [
    { temp: 15, alcohol40: 39.6, alcohol60: 59.3, alcohol80: 79.0, alcohol95: 94.8 },
    { temp: 16, alcohol40: 39.6, alcohol60: 59.3, alcohol80: 79.3, alcohol95: 95.0 },
    { temp: 17, alcohol40: 39.7, alcohol60: 59.4, alcohol80: 79.7, alcohol95: 95.2 },
    { temp: 18, alcohol40: 39.8, alcohol60: 59.6, alcohol80: 80.0, alcohol95: 95.4 },
    { temp: 19, alcohol40: 39.9, alcohol60: 59.8, alcohol80: 80.3, alcohol95: 95.6 },
    { temp: 20, alcohol40: 40.0, alcohol60: 60.0, alcohol80: 80.7, alcohol95: 96.0 },
    { temp: 21, alcohol40: 40.1, alcohol60: 60.2, alcohol80: 81.0, alcohol95: 96.2 },
    { temp: 22, alcohol40: 40.3, alcohol60: 60.5, alcohol80: 81.3, alcohol95: 96.4 },
    { temp: 23, alcohol40: 40.4, alcohol60: 60.7, alcohol80: 81.7, alcohol95: 96.6 },
    { temp: 24, alcohol40: 40.6, alcohol60: 61.0, alcohol80: 82.0, alcohol95: 96.8 },
    { temp: 25, alcohol40: 40.8, alcohol60: 61.3, alcohol80: 82.3, alcohol95: 97.0 }
  ];

  const commonMistakes = [
    {
      mistake: "عدم مراعاة درجة الحرارة",
      correction: "استخدم دائماً جداول تصحيح OIML عند القياس في درجة حرارة غير 20°C",
      severity: "high"
    },
    {
      mistake: "خلط الوحدات (لتر/هيكتوليتر)",
      correction: "تأكد من استخدام نفس الوحدة في جميع الحسابات",
      severity: "medium"
    },
    {
      mistake: "إهمال حساب الكحول النقي",
      correction: "احسب دائماً كمية الكحول النقي للتحقق من صحة النتائج",
      severity: "medium"
    },
    {
      mistake: "عدم مراعاة الفقد أثناء العمليات",
      correction: "أضف 2-5% احتياطي لتعويض الفقد المتوقع",
      severity: "low"
    }
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
      toast({
        title: "تم النسخ",
        description: "تم نسخ المعادلة إلى الحافظة",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ النص",
        variant: "destructive",
      });
    }
  };

  const filterConversions = (category: string) => {
    return conversions.filter(conv => category === "all" || conv.category === category);
  };

  return (
    <TooltipProvider>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            دليل تحويلات الكحول
          </CardTitle>
          <p className="text-sm text-gray-600">
            مرجع شامل للمعادلات والتحويلات مع أمثلة عملية
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="formulas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="formulas" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                المعادلات
              </TabsTrigger>
              <TabsTrigger value="temperature" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                درجة الحرارة
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                نصائح
              </TabsTrigger>
            </TabsList>

            <TabsContent value="formulas" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="cursor-pointer">الكل</Badge>
                <Badge variant="outline" className="cursor-pointer">التخفيف</Badge>
                <Badge variant="outline" className="cursor-pointer">رفع التركيز</Badge>
                <Badge variant="outline" className="cursor-pointer">الحسابات</Badge>
                <Badge variant="outline" className="cursor-pointer">الوحدات</Badge>
                <Badge variant="outline" className="cursor-pointer">الخلط</Badge>
              </div>

              <div className="grid gap-4">
                {filterConversions("all").map((conversion, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{conversion.title}</h3>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{conversion.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg mb-3 font-mono text-sm">
                            {conversion.formula}
                          </div>
                          
                          <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border-r-2 border-blue-200">
                            <strong>مثال:</strong> {conversion.example}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(conversion.formula, `formula-${index}`)}
                          className="mr-2"
                        >
                          {copiedItem === `formula-${index}` ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="temperature" className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold">تصحيحات درجة الحرارة OIML</h3>
                </div>
                <p className="text-sm text-yellow-700">
                  القيم الفعلية عند 20°C بناء على القراءات المقيسة في درجات حرارة مختلفة
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-center">درجة الحرارة (°C)</th>
                      <th className="border border-gray-300 p-2 text-center">40% مقيس</th>
                      <th className="border border-gray-300 p-2 text-center">60% مقيس</th>
                      <th className="border border-gray-300 p-2 text-center">80% مقيس</th>
                      <th className="border border-gray-300 p-2 text-center">95% مقيس</th>
                    </tr>
                  </thead>
                  <tbody>
                    {temperatureCorrections.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-300 p-2 text-center font-medium">
                          {row.temp}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {row.alcohol40}%
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {row.alcohol60}%
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {row.alcohol80}%
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {row.alcohol95}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">كيفية استخدام الجدول:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• ابحث عن درجة الحرارة الحالية في العمود الأول</li>
                  <li>• ابحث عن القراءة المقيسة في العمود المناسب</li>
                  <li>• القيمة الموضحة هي التركيز الفعلي عند 20°C</li>
                  <li>• مثال: 97% مقيس عند 23°C = 96.6% فعلي عند 20°C</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <div className="grid gap-4">
                <Card className="border border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      أخطاء شائعة وتجنبها
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {commonMistakes.map((mistake, index) => (
                      <div key={index} className="border-r-4 border-orange-300 bg-white p-3 rounded">
                        <div className="flex items-start gap-2">
                          <Badge 
                            variant="outline" 
                            className={`mt-1 ${
                              mistake.severity === 'high' ? 'border-red-300 text-red-700' :
                              mistake.severity === 'medium' ? 'border-yellow-300 text-yellow-700' :
                              'border-green-300 text-green-700'
                            }`}
                          >
                            {mistake.severity === 'high' ? 'عالي' : 
                             mistake.severity === 'medium' ? 'متوسط' : 'منخفض'}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium text-red-700 mb-1">❌ {mistake.mistake}</p>
                            <p className="text-sm text-green-700">✅ {mistake.correction}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">نصائح للدقة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• قس درجة الحرارة دائماً قبل أخذ القراءة</li>
                      <li>• استخدم أدوات قياس معايرة ومعتمدة</li>
                      <li>• احسب كمية الكحول النقي للتحقق من النتائج</li>
                      <li>• اترك الخليط يستقر لمدة 15-20 دقيقة قبل القياس</li>
                      <li>• سجل جميع القراءات والحسابات لمراجعتها لاحقاً</li>
                      <li>• تأكد من نظافة جميع الأدوات قبل الاستخدام</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">تحويلات سريعة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">الوحدات:</h4>
                        <ul className="space-y-1 text-blue-700">
                          <li>• 1 هيكتوليتر = 100 لتر</li>
                          <li>• 1 لتر = 1000 مليلتر</li>
                          <li>• 1 متر مكعب = 1000 لتر</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">تقريبات مفيدة:</h4>
                        <ul className="space-y-1 text-blue-700">
                          <li>• كل 1°C تعادل ~0.35% تصحيح</li>
                          <li>• فقد نموذجي: 2-5%</li>
                          <li>• دقة القياس: ±0.1%</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}