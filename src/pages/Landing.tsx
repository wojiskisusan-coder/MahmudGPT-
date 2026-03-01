import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Brain, Code, Search, BarChart3, Image, Pencil, ArrowRight, Crown, Shield, Globe, Cpu, MessageSquare, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import RGBBackground from "@/components/RGBBackground";

const FEATURES = [
  { icon: Brain, title: "Deep Reasoning", desc: "Multi-step thinking with visible thought process", color: "from-purple-500 to-violet-600" },
  { icon: Code, title: "Code IDE", desc: "Full IDE with syntax highlighting & live preview", color: "from-emerald-500 to-teal-600" },
  { icon: Search, title: "Deep Research", desc: "Multi-source analysis with downloadable reports", color: "from-cyan-500 to-blue-600" },
  { icon: BarChart3, title: "Data Analysis", desc: "Charts, tables & statistical insights", color: "from-rose-500 to-pink-600" },
  { icon: Image, title: "Image Generation", desc: "Create stunning visuals from text prompts", color: "from-indigo-500 to-purple-600" },
  { icon: Pencil, title: "Writing Canvas", desc: "Long-form writing with markdown & export", color: "from-amber-500 to-orange-600" },
];

const STATS = [
  { value: "11+", label: "AI Modes" },
  { value: "∞", label: "Possibilities" },
  { value: "< 1s", label: "Response Time" },
  { value: "24/7", label: "Available" },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <RGBBackground modeColor="purple" />

      {/* Nav - Compact, non-blocking */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
          </div>
          <h1 className="text-xs sm:text-base font-bold font-['Space_Grotesk'] gradient-text">MahmudGPT</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate("/auth")}
            className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-medium border border-border/30 hover:border-primary/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all text-foreground"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/auth?tab=signup")}
            className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-xs font-bold shiny-button text-primary-foreground"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero - Mobile optimized with proper spacing */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-8 pb-8 sm:pt-16 sm:pb-14 md:pt-24 md:pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-4 sm:mb-6"
        >
          <div className="h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center animate-hero-glow rgb-border">
            <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 h-5 w-5 sm:h-7 sm:w-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
            <Zap className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-primary-foreground" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-['Space_Grotesk'] mb-2 sm:mb-3 leading-tight"
        >
          <span className="gradient-text">MahmudGPT</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-sm sm:max-w-lg mb-3 px-2"
        >
          The world's most powerful AI platform. Think. Create. Analyze. Research. Code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-5 sm:mb-7"
        >
          {["Fast", "Intelligent", "Analytical", "Premium", "Alive"].map((w) => (
            <span key={w} className="px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium border border-primary/30 bg-primary/5 text-primary">
              {w}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3"
        >
          <button
            onClick={() => navigate("/auth?tab=signup")}
            className="flex items-center gap-2 px-5 sm:px-8 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-bold shiny-button text-primary-foreground animate-upgrade-glow"
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Start Free — No Credit Card
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium border border-border/50 hover:border-primary/50 bg-accent/20 hover:bg-accent/40 transition-all text-muted-foreground hover:text-foreground"
          >
            Sign In
          </button>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-4 sm:px-6 pb-10 sm:pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
              className="glass-panel-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center premium-card"
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text font-['Space_Grotesk']">{s.value}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 sm:mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-3xl font-bold font-['Space_Grotesk'] text-center mb-2 sm:mb-3 gradient-text"
          >
            Powered by Intelligence
          </motion.h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center mb-6 sm:mb-10 max-w-md mx-auto">
            One platform, infinite capabilities.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel-strong rounded-xl sm:rounded-2xl p-3 sm:p-5 premium-card group"
              >
                <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h4 className="text-[11px] sm:text-sm font-bold mb-0.5 sm:mb-1 font-['Space_Grotesk']">{f.title}</h4>
                <p className="text-[9px] sm:text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="relative z-10 px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="max-w-3xl mx-auto glass-panel-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center rgb-border">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            {[
              { icon: Shield, label: "Enterprise Security" },
              { icon: Globe, label: "Multi-language" },
              { icon: Cpu, label: "Latest AI Models" },
              { icon: Crown, label: "Premium Quality" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                <t.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                {t.label}
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/auth?tab=signup")}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shiny-button text-primary-foreground animate-upgrade-glow"
          >
            <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/10 glass-panel-strong px-4 sm:px-6 py-4 sm:py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="text-xs sm:text-sm font-bold font-['Space_Grotesk'] gradient-text">MahmudGPT</span>
        </div>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground">© 2025 MahmudGPT. Built by Mahmud. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
