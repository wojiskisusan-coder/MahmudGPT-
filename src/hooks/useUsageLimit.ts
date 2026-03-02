import { useState, useEffect, useCallback } from "react";

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

  // Check pro status - defaulting to false as auth is removed
  const checkProStatus = useCallback(async () => {
    setIsPro(false);
    setProLoading(false);
  }, []);

  useEffect(() => {
    checkProStatus();
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
