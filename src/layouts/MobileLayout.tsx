import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MobileHeader from "@/components/chat/MobileHeader";

interface MobileLayoutProps {
  children: React.ReactNode;
  headerProps: React.ComponentProps<typeof MobileHeader>;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, headerProps }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-dvh overflow-hidden relative bg-background"
    >
      <MobileHeader {...headerProps} />
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-[80px]">
        {children}
      </div>
    </motion.div>
  );
};

export default MobileLayout;
