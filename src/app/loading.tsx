import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  );
} 