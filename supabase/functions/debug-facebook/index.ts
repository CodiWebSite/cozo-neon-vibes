const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const token = Deno.env.get("FACEBOOK_PAGE_ACCESS_TOKEN") ?? "";
  const pageId = Deno.env.get("FACEBOOK_PAGE_ID") ?? "";

  const get = async (path: string) => {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${path}${path.includes("?") ? "&" : "?"}access_token=${token}`,
    );
    return { status: res.status, body: await res.json() };
  };

  const out: Record<string, unknown> = {
    tokenLength: token.length,
    me: await get("me?fields=id,name"),
    accounts: await get("me/accounts?fields=id,name&limit=25"),
    page: await get(`${pageId}?fields=id,name,rating_count,overall_star_rating`),
    ratings: await get(`${pageId}/ratings?fields=created_time,rating,review_text&limit=3`),
  };

  return new Response(JSON.stringify(out, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
