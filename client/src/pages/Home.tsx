import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import DilutionCalculator from "@/components/DilutionCalculator";
import OIMLCorrection from "@/components/OIMLCorrection";
import DistillationLog from "@/components/DistillationLog";
import TankManagement from "@/components/TankManagement";
import MixingCalculator from "@/components/MixingCalculator";
import AlcoholConcentrationCalculator from "@/components/AlcoholConcentrationCalculator";
import AlcoholCheatSheet from "@/components/AlcoholCheatSheet";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dilution");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dilution":
        return <DilutionCalculator />;
      case "concentration":
        return <AlcoholConcentrationCalculator />;
      case "correction":
        return <OIMLCorrection />;
      case "log":
        return <DistillationLog />;
      case "tanks":
        return <TankManagement />;
      case "mixing":
        return <MixingCalculator />;
      case "cheatsheet":
        return <AlcoholCheatSheet />;
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
