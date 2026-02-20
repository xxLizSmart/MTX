import { createClient } from "npm:@supabase/supabase-js@2.47.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ success: false, error: "Missing authorization" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile } = await adminClient
      .from("profiles")
      .select("is_admin, role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || (!profile.is_admin && profile.role !== "admin")) {
      return jsonResponse({ success: false, error: "Not authorized as admin" }, 403);
    }

    const { action, table, id } = await req.json();

    if (!action || !table || !id) {
      return jsonResponse({ success: false, error: "Missing action, table, or id" }, 400);
    }
    if (!["deposits", "withdrawals"].includes(table)) {
      return jsonResponse({ success: false, error: "Invalid table" }, 400);
    }
    if (!["approve", "reject"].includes(action)) {
      return jsonResponse({ success: false, error: "Invalid action" }, 400);
    }

    const { data: record, error: fetchError } = await adminClient
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !record) {
      return jsonResponse({ success: false, error: "Record not found" }, 404);
    }
    if (record.status !== "pending") {
      return jsonResponse({ success: false, error: "Record is not pending" }, 400);
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const { error: updateError } = await adminClient
      .from(table)
      .update({
        status: newStatus,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return jsonResponse({ success: false, error: updateError.message }, 500);
    }

    const shouldAddBalance =
      (table === "deposits" && action === "approve") ||
      (table === "withdrawals" && action === "reject");

    if (shouldAddBalance) {
      const { data: existing } = await adminClient
        .from("user_assets")
        .select("id, amount")
        .eq("user_id", record.user_id)
        .eq("symbol", record.currency)
        .maybeSingle();

      if (existing) {
        const { error: balError } = await adminClient
          .from("user_assets")
          .update({
            amount: parseFloat(existing.amount) + parseFloat(record.amount),
          })
          .eq("id", existing.id);
        if (balError) {
          return jsonResponse({
            success: false,
            error: "Status updated but balance update failed: " + balError.message,
          }, 500);
        }
      } else {
        const { error: insError } = await adminClient
          .from("user_assets")
          .insert({
            user_id: record.user_id,
            symbol: record.currency,
            amount: parseFloat(record.amount),
          });
        if (insError) {
          return jsonResponse({
            success: false,
            error: "Status updated but balance insert failed: " + insError.message,
          }, 500);
        }
      }
    }

    return jsonResponse({ success: true, status: newStatus });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
});
