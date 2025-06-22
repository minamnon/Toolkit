import { Factory } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">EGYBEV</h1>
        <Factory className="h-6 w-6" />
      </div>
    </header>
  );
}
