import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserSupabaseClient } from "@/lib/supabaseClient";

export function useSession() {
  const supabase = useMemo(() => {
    try {
      return getBrowserSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [envMissing, setEnvMissing] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    async function init() {
      if (!supabase) {
        setEnvMissing(true);
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, nextSession) => {
          setSession(nextSession);
        },
      );
      unsub = () => listener.subscription.unsubscribe();
    }

    void init();
    return () => {
      unsub?.();
    };
  }, [supabase]);

  return { supabase, session, loading, envMissing };
}

