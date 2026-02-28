import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { auth, isConfigured as isFirebaseConfigured } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import RGBBackground from "@/components/RGBBackground";
import { useToast } from "@/hooks/use-toast";

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"signin" | "signup">(searchParams.get("tab") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/chat");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !auth) {
      toast({ 
        title: "Configuration Required", 
        description: "Please set your Firebase environment variables in AI Studio.",
        variant: "destructive" 
      });
      return;
    }
    setLoading(true);
    try {
      if (tab === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Use the specific redirect URL for email verification
        const actionCodeSettings = {
          url: "https://ai.studio/apps/9a7d4375-3b93-46fd-ac26-4b856b558987?fullscreenApplet=true",
          handleCodeInApp: true,
        };
        
        await sendEmailVerification(userCredential.user, actionCodeSettings);
        toast({ 
          title: "Account created!", 
          description: "A verification email has been sent. Please check your inbox to verify for MahmudGPT." 
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back!", description: "Successfully signed in." });
      }
    } catch (err: unknown) {
      console.error("Auth error:", err);
      let message = "An error occurred during authentication.";
      if (err && typeof err === "object" && "code" in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === "auth/email-already-in-use") message = "This email is already in use.";
        if (firebaseError.code === "auth/invalid-credential") message = "Invalid email or password.";
        if (firebaseError.code === "auth/weak-password") message = "Password should be at least 6 characters.";
      }
      
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-3 sm:px-4">
      <RGBBackground modeColor="purple" />

      <button
        onClick={() => navigate("/")}
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-muted-foreground hover:text-foreground glass-panel-strong border border-border/20 transition-all hover:border-primary/30"
      >
        <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md"
      >
        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 glass-panel-strong border-destructive/50 border bg-destructive/10 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-destructive">Firebase Not Configured</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Authentication is currently disabled. Please add your Firebase API keys to the environment variables in AI Studio to enable sign-in.
              </p>
            </div>
          </div>
        )}

        <div className="glass-panel-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 rgb-border">
          {/* Logo */}
          <div className="flex flex-col items-center mb-5 sm:mb-8">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center animate-hero-glow rgb-border mb-3 sm:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] gradient-text">MahmudGPT</h1>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1">
              {tab === "signin" ? "Welcome back! Sign in to continue" : "Create your free account"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-accent/30 border border-border/20 mb-4 sm:mb-6">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                  tab === t
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-center text-sm font-medium text-muted-foreground">Sign in with email</h2>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-2.5 sm:space-y-3">
            {tab === "signup" && (
              <div className="relative">
                <User className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <input
                  type="text" placeholder="Your name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-accent/20 border border-border/30 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <input
                type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-accent/20 border border-border/30 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"} placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-accent/20 border border-border/30 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              </button>
            </div>
            <button
              type="submit" disabled={loading || !isFirebaseConfigured}
              className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shiny-button text-primary-foreground disabled:opacity-50 transition-all"
            >
              {loading ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-[8px] sm:text-[10px] text-muted-foreground/50 text-center mt-3 sm:mt-4">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
