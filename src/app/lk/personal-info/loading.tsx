import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Briefcase } from "lucide-react";
import { Preloader } from "@/components/ui/preloader";

export default function Loading() {
  return (
    <div className="relative min-h-full">
      <Preloader />
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <Skeleton className="h-20 w-20 rounded-full sm:h-24 sm:w-24" />
                <div className="text-center sm:text-left w-full sm:w-[60%]">
                  <Skeleton className="h-8 w-[250px] mb-2" />
                  <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                    <Briefcase className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                    <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="mt-6">
                <CardTitle>Личные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="mt-6">
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-4 w-4 mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="mt-6">
                <CardTitle>Информация о работе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-40" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-40" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 