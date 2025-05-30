import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Drum, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TankManagement() {
  const [st1Cm, setSt1Cm] = useState("");
  const [st1Total, setSt1Total] = useState("");
  const [st2Cm, setSt2Cm] = useState("");
  const [st2Total, setSt2Total] = useState("");
  const [fwSections, setFwSections] = useState("");
  const [fwTotal, setFwTotal] = useState("");
  
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
    const total = (cm * 28.5) + 605;
    setSt1Total(total.toFixed(2));
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
    const total = (cm * 20.4) + 305;
    setSt2Total(total.toFixed(2));
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
    const total = sections * 550;
    setFwTotal(total.toFixed(2));
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
                الحجم الكلي (لتر)
              </Label>
              <Input
                id="st1-total"
                type="number"
                value={st1Total}
                readOnly
                className="mt-1 bg-muted"
              />
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
                الحجم الكلي (لتر)
              </Label>
              <Input
                id="st2-total"
                type="number"
                value={st2Total}
                readOnly
                className="mt-1 bg-muted"
              />
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
                الحجم الكلي (لتر)
              </Label>
              <Input
                id="fw-total"
                type="number"
                value={fwTotal}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>
          </div>
          <Button onClick={calculateFW} className="mt-3 w-full" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            احسب الحجم
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
