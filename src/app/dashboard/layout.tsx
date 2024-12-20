"use client";

import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <Card className="w-9/12 min-w-fit max-w-screen-lg h-[54rem]">
        {children}
      </Card>
      <Toaster />
    </div>
  );
}
