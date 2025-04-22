import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreloaderProps {
  className?: string;
}

export function Preloader({ className }: PreloaderProps) {
  return (
    <div className={cn(
      "absolute inset-0 z-50 bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    </div>
  );
} 