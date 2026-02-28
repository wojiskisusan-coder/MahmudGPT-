import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const FREE_DAILY_LIMIT = 30;
const STORAGE_KEY = "mahmudai-usage";

interface UsageData {
  count: number;
  date: string;
}

export function useUsageLimit() {
  const today = new Date().toISOString().slice(0, 10);

  const [usage, setUsage] = useState<UsageData>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (stored.date === today) return stored;
      return { count: 0, date: today };
    } catch {
      return { count: 0, date: today };
    }
  });

  const [isPro, setIsPro] = useState(false);
  const [proLoading, setProLoading] = useState(true);

  // Check pro status
  const checkProStatus = useCallback(async () => {
    try {
      if (!auth) { setIsPro(false); setProLoading(false); return; }
      const user = auth.currentUser;
      if (!user) { setIsPro(false); setProLoading(false); return; }

      // Since Supabase is unavailable, we'll default to false for Pro status
      setIsPro(false);
    } catch {
      setIsPro(false);
    } finally {
      setProLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setProLoading(false);
      checkProStatus(); // Run it once to set initial state
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, () => {
      checkProStatus();
    });
    return () => unsubscribe();
  }, [checkProStatus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  }, [usage]);

  const canSend = isPro || usage.count < FREE_DAILY_LIMIT;
  const remaining = FREE_DAILY_LIMIT - usage.count;

  const increment = () => {
    if (isPro) return;
    setUsage(prev => {
      const d = new Date().toISOString().slice(0, 10);
      if (prev.date !== d) return { count: 1, date: d };
      return { ...prev, count: prev.count + 1 };
    });
  };

  return { count: usage.count, limit: FREE_DAILY_LIMIT, canSend, remaining, isPro, increment, proLoading, refreshPro: checkProStatus };
}
