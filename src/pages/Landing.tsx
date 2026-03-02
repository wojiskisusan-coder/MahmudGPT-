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
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="liquid-mesh" />
      <RGBBackground modeColor="purple" />

      {/* Nav - Compact, non-blocking */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] gradient-text tracking-tight">MahmudGPT</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="px-5 py-2 rounded-xl text-sm font-bold liquid-glass text-foreground hover:bg-card/40 transition-all border border-primary/20 hover:border-primary/50"
          >
            Launch Experience
          </button>
        </div>
      </nav>

      {/* Hero - Mobile optimized with proper spacing */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 pb-12 sm:pt-24 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <div className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center animate-hero-glow rgb-border shadow-2xl shadow-primary/40">
            <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-primary-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse shadow-lg">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-6 max-w-4xl"
        >
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-['Space_Grotesk'] tracking-tighter leading-[0.85]">
            Intelligence <br />
            <span className="gradient-text">Redefined.</span>
          </h2>
          
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the next generation of AI. Liquid interface, deep reasoning, and unparalleled creativity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => navigate("/chat")}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold shiny-button text-primary-foreground animate-upgrade-glow overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Chatting <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl text-base font-medium liquid-glass text-muted-foreground hover:text-foreground transition-all"
          >
            Explore Features
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
        >
          {/* Mock partners/tech stack */}
          <div className="flex items-center gap-2 font-bold text-lg"><Cpu className="h-5 w-5" /> NVIDIA</div>
          <div className="flex items-center gap-2 font-bold text-lg"><Globe className="h-5 w-5" /> GOOGLE</div>
          <div className="flex items-center gap-2 font-bold text-lg"><Shield className="h-5 w-5" /> OPENAI</div>
        </motion.div>
      </section>

      {/* Stats - Liquid Glass Cards */}
      <section className="relative z-10 px-4 sm:px-8 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass rounded-3xl p-8 text-center premium-card"
            >
              <p className="text-3xl sm:text-4xl font-bold gradient-text font-['Space_Grotesk'] mb-2">{s.value}</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-widest">{s.label}</p>
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
            onClick={() => navigate("/chat")}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shiny-button text-primary-foreground animate-upgrade-glow"
          >
            <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Launch Experience — It's Free
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
