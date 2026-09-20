import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

interface TestimonialRow {
  id: string;
  source: string;
  author_name: string;
  author_avatar: string | null;
  role: string | null;
  content: string;
  rating: number | null;
  recommendation_type: string | null;
  permalink: string | null;
  reviewed_at: string | null;
}

const TestimonialCard = ({ item }: { item: TestimonialRow }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.content.length > 280;
  const text = expanded || !isLong ? item.content : `${item.content.slice(0, 280).trim()}…`;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={item.author_avatar ?? undefined} alt={item.author_name} loading="lazy" />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {item.author_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-lg truncate">{item.author_name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {item.role ?? (item.source === "facebook" ? "Recenzie Facebook" : "Client")}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-3">
          {item.rating ? (
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < (item.rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/40"}`}
                />
              ))}
            </span>
          ) : item.recommendation_type === "positive" ? (
            <Badge variant="outline" className="border-primary/40 text-primary gap-1">
              <ThumbsUp className="w-3 h-3" /> Recomandă
            </Badge>
          ) : null}
          {item.source === "facebook" && (
            <Badge variant="outline" className="border-border text-muted-foreground text-xs">
              Facebook
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <blockquote className="italic text-muted-foreground leading-relaxed flex-1">
          „{text}"
        </blockquote>
        {isLong && (
          <Button
            variant="link"
            className="px-0 self-start text-primary"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Arată mai puțin" : "Citește tot"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const { t } = useSiteContent();
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data } = useQuery({
    queryKey: ["testimonials"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("reviewed_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as TestimonialRow[];
    },
  });

  const items = data ?? [];
  if (items.length === 0) return null;

  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visible.length;

  return (
    <section id="testimoniale" className="section-spacing bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{t('testimonials_title', 'Ce spun clienții')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('testimonials_subtitle', 'Recenzii reale de la evenimente de neuitat')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {visible.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>

        {items.length > 4 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Arată mai puține" : `Vezi toate recenziile (${items.length})`}
            </Button>
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href={t('testimonials_facebook_url', 'https://www.facebook.com/DJDavidCozo/reviews')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {t('testimonials_facebook_button', 'Mai multe recenzii pe Facebook')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
