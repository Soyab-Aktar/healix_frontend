"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className={cn("flex-1 flex flex-col", !isHomePage && "pt-24 md:pt-28")}>
      {children}
    </div>
  );
}
