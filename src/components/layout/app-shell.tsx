import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="pb-20 md:ml-64 md:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}