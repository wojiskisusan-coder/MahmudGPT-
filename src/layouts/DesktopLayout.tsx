import React from "react";
import { cn } from "@/lib/utils";

interface DesktopLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  theme?: string;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children, sidebar, header, theme }) => {
  return (
    <div className="flex h-dvh overflow-hidden relative bg-background">
      {sidebar}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 relative z-10",
        theme === "ios" && "bg-background"
      )}>
        {header}
        {children}
      </div>
    </div>
  );
};

export default DesktopLayout;
