import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, targetEmail, adminSecret } = await req.json();
    
    // Secret admin passphrase - only you know this
    const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET");
    if (!ADMIN_SECRET || adminSecret !== ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Find user by email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;
    
    const targetUser = users.find(u => u.email === targetEmail);
    if (!targetUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "grant") {
      const { error } = await supabase
        .from("pro_subscriptions")
        .upsert({ user_id: targetUser.id, is_active: true, granted_by: "admin" }, { onConflict: "user_id" });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: `Pro granted to ${targetEmail}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "revoke") {
      const { error } = await supabase
        .from("pro_subscriptions")
        .update({ is_active: false })
        .eq("user_id", targetUser.id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: `Pro revoked from ${targetEmail}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list") {
      const { data } = await supabase
        .from("pro_subscriptions")
        .select("*")
        .eq("is_active", true);
      const proUsers = (data || []).map(s => {
        const u = users.find(u => u.id === s.user_id);
        return { email: u?.email, granted_at: s.created_at };
      });
      return new Response(JSON.stringify({ success: true, proUsers }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use: grant, revoke, list" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-pro error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
