import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import DilutionCalculator from "@/components/DilutionCalculator";
import OIMLCorrection from "@/components/OIMLCorrection";
import DistillationLog from "@/components/DistillationLog";
import TankManagement from "@/components/TankManagement";
import ContainerClassification from "@/components/ContainerClassification";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dilution");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dilution":
        return <DilutionCalculator />;
      case "correction":
        return <OIMLCorrection />;
      case "log":
        return <DistillationLog />;
      case "tanks":
        return <TankManagement />;
      case "classification":
        return <ContainerClassification />;
      default:
        return <DilutionCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />
      
      <main className="p-4 pb-20">
        {renderActiveComponent()}
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
