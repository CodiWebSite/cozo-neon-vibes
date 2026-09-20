import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface FbRating {
  created_time?: string;
  rating?: number;
  recommendation_type?: string;
  review_text?: string;
  open_graph_story?: { id?: string };
  reviewer?: { id?: string; name?: string; picture?: { data?: { url?: string } } };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const cronSecret = Deno.env.get("SYNC_CRON_SECRET");

    // Auth: either an admin user JWT, or the internal cron secret header.
    const cronHeader = req.headers.get("x-cron-secret");
    const isCron = !!cronSecret && cronHeader === cronSecret;

    if (!isCron) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData } = await userClient.auth.getUser();
      const user = userData?.user;
      if (!user) return json({ error: "Neautentificat" }, 401);

      const { data: isAdmin } = await userClient.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!isAdmin) return json({ error: "Acces interzis" }, 403);
    }

    const token = Deno.env.get("FACEBOOK_PAGE_ACCESS_TOKEN");
    const pageId = Deno.env.get("FACEBOOK_PAGE_ID");
    if (!token || !pageId) {
      return json(
        {
          error:
            "Lipsesc setările Facebook (FACEBOOK_PAGE_ACCESS_TOKEN / FACEBOOK_PAGE_ID).",
        },
        400,
      );
    }

    const fields =
      "created_time,rating,recommendation_type,review_text,open_graph_story{id},reviewer{id,name,picture{url}}";
    const url = `https://graph.facebook.com/v21.0/${pageId}/ratings?fields=${encodeURIComponent(
      fields,
    )}&limit=100&access_token=${token}`;

    const fbRes = await fetch(url);
    const fbBody = await fbRes.json();

    if (!fbRes.ok || fbBody.error) {
      console.error("Facebook API error", JSON.stringify(fbBody));
      return json(
        {
          error:
            fbBody?.error?.message ??
            "Facebook a refuzat cererea. Verifică tokenul paginii și permisiunile.",
        },
        502,
      );
    }

    const ratings: FbRating[] = fbBody.data ?? [];
    const admin = createClient(supabaseUrl, serviceKey);

    let imported = 0;
    for (const r of ratings) {
      const text = (r.review_text ?? "").trim();
      if (!text) continue; // recomandări fără text nu au ce afișa

      const externalId =
        r.open_graph_story?.id ??
        `${r.reviewer?.id ?? "anon"}-${r.created_time ?? ""}`;

      const row = {
        source: "facebook",
        external_id: externalId,
        author_name: r.reviewer?.name ?? "Recenzie Facebook",
        author_avatar: r.reviewer?.picture?.data?.url ?? null,
        content: text,
        rating: r.rating ?? (r.recommendation_type === "positive" ? 5 : null),
        recommendation_type: r.recommendation_type ?? null,
        permalink: `https://www.facebook.com/${pageId}/reviews`,
        reviewed_at: r.created_time ?? null,
      };

      // Dacă recenzia există deja, păstrăm numele editat manual în panou.
      const { data: existing } = await admin
        .from("testimonials")
        .select("id")
        .eq("external_id", externalId)
        .maybeSingle();

      const { author_name: _fbName, ...rowNoName } = row;
      const { error } = existing
        ? await admin.from("testimonials").update(rowNoName).eq("id", existing.id)
        : await admin.from("testimonials").insert(row);

      if (error) {
        console.error("upsert failed", error.message);
        continue;
      }
      imported++;
    }

    return json({ ok: true, fetched: ratings.length, imported });
  } catch (error) {
    console.error("sync-facebook-reviews failed", error);
    return json(
      { error: error instanceof Error ? error.message : "Eroare necunoscută" },
      500,
    );
  }
});
