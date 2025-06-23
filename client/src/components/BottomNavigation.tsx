import { 
  FlaskRound, 
  TrendingUp,
  Thermometer, 
  ClipboardList, 
  Drum, 
  Beaker 
} from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "dilution", label: "التخفيف", icon: FlaskRound },
    { id: "concentration", label: "رفع التركيز", icon: TrendingUp },
    { id: "correction", label: "التصحيح", icon: Thermometer },
    { id: "log", label: "السجل", icon: ClipboardList },
    { id: "tanks", label: "التانكات", icon: Drum },
    { id: "mixing", label: "الدمج", icon: Beaker },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center p-2 text-xs transition-colors ${
                activeTab === tab.id 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
