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
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : null;
      if (stored && typeof stored === 'object' && stored.date === today) {
        return {
          count: typeof stored.count === 'number' ? stored.count : 0,
          date: String(stored.date)
        };
      }
      return { count: 0, date: today };
    } catch {
      return { count: 0, date: today };
    }
  });

  const [isPro, setIsPro] = useState(true);
  const [proLoading, setProLoading] = useState(false);

  // Check pro status - defaulting to true as auth is removed
  const checkProStatus = useCallback(async () => {
    setIsPro(true);
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
