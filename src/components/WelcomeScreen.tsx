import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const WelcomeScreen: React.FC = () => {
  const [show, setShow] = useState(() => !localStorage.getItem("mahmudgpt-welcomed"));
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setShowButton(true), 1000);
    }
  }, [show]);

  const handleStart = () => {
    localStorage.setItem("mahmudgpt-welcomed", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-3xl"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent rounded-full blur-3xl scale-150 animate-pulse" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center shadow-2xl shadow-primary/30"
            >
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-bold font-['Space_Grotesk'] gradient-text">MahmudGPT</h1>
            <p className="text-muted-foreground text-sm">Your AI Assistant</p>
          </motion.div>

          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onClick={handleStart}
                className="mt-12 px-8 py-3 rounded-2xl font-bold text-primary-foreground shiny-button shadow-lg shadow-primary/25"
              >
                Get Started
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
