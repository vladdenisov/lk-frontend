import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { requireAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";
import { Preloader } from "@/components/ui/preloader";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This will redirect to /auth/login if not authenticated
  await requireAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col p-0">
          <SiteHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 relative">
              <Suspense fallback={<Preloader />}>
                {children}
              </Suspense>
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}