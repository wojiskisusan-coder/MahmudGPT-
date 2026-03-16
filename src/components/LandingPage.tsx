import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Mic, Code, Pencil, Search, Zap, Shield, Cpu, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mic,
      title: "Voice Interaction",
      description: "Speak naturally with MahmudGPT. Real-time voice chat with realistic AI voices.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Search,
      title: "Deep Research",
      description: "Advanced analysis and reasoning for complex queries and data synthesis.",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: Code,
      title: "Code Canvas",
      description: "A dedicated workspace to write, run, and debug code with AI assistance.",
      color: "from-emerald-500 to-teal-400"
    },
    {
      icon: Pencil,
      title: "Writing Canvas",
      description: "Craft perfect documents, essays, and stories in a distraction-free editor.",
      color: "from-orange-500 to-yellow-400"
    },
    {
      icon: Zap,
      title: "Multimodal Power",
      description: "Upload images and videos for instant analysis and creative insights.",
      color: "from-red-500 to-rose-400"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays local. Secure, private, and always under your control.",
      color: "from-indigo-500 to-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <div className="liquid-mesh opacity-50" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-['Space_Grotesk'] gradient-text">MahmudGPT</span>
        </div>
        <Button 
          onClick={() => navigate("/chat")}
          className="rounded-full px-6 shiny-button font-semibold h-10 min-h-0 min-w-0"
        >
          Launch App
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-float">
            <Zap className="h-4 w-4" />
            <span>Next-Gen AI Experience</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] tracking-tight leading-[1.1]">
            Experience Intelligence <br />
            <span className="gradient-text">Beyond Boundaries</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            MahmudGPT combines advanced reasoning, multimodal capabilities, and creative tools 
            into one seamless, beautiful interface.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/chat")}
              className="h-14 px-10 rounded-2xl text-lg font-bold shiny-button w-full sm:w-auto"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-10 rounded-2xl text-lg font-semibold border-white/10 hover:bg-white/5 w-full sm:w-auto"
            >
              View Features
            </Button>
          </div>
        </motion.div>

        {/* Hero Image/Mockup Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10 bg-card/50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 opacity-40">
              <Cpu className="h-20 w-20 text-primary" />
              <p className="font-mono text-sm uppercase tracking-widest">System Initializing...</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk']">Upgraded Features</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to create, research, and communicate with AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="premium-card glass-panel-strong p-8 rounded-[2rem] space-y-4 group"
            >
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mobile Optimization Highlight */}
      <section className="py-20 px-6 bg-accent/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk']">
              Optimized for <br />
              <span className="gradient-text">Every Screen</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're on your desktop, tablet, or smartphone, MahmudGPT provides a 
              native-like experience with smooth animations and responsive layouts.
            </p>
            <ul className="space-y-3">
              {[
                "Safe area support for modern smartphones",
                "Touch-optimized controls and gestures",
                "Adaptive sidebars and navigation",
                "Lightweight and fast performance"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex justify-center">
             <div className="w-64 h-[500px] rounded-[3rem] border-[8px] border-card bg-background shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-card rounded-b-2xl z-10" />
                <div className="p-4 pt-10 space-y-4">
                   <div className="h-4 w-3/4 bg-accent rounded-full" />
                   <div className="h-32 w-full bg-accent/50 rounded-2xl" />
                   <div className="space-y-2">
                      <div className="h-3 w-full bg-accent rounded-full" />
                      <div className="h-3 w-5/6 bg-accent rounded-full" />
                   </div>
                   <div className="absolute bottom-4 left-4 right-4 h-12 bg-primary/20 rounded-2xl border border-primary/30 flex items-center px-4">
                      <div className="h-2 w-full bg-primary/40 rounded-full" />
                   </div>
                </div>
             </div>
             <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />
             <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-accent/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center relative">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold font-['Space_Grotesk']">
            Ready to start your <br />
            AI journey?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users experiencing the future of AI interaction.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/chat")}
            className="h-16 px-12 rounded-2xl text-xl font-bold shiny-button w-full sm:w-auto"
          >
            Launch MahmudGPT Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-muted-foreground text-sm">
        <p>© 2026 MahmudGPT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
