// src/components/Testimonials.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ExternalLink } from "lucide-react";

type FbEmbed = {
  name: string;
  event: string;
  rating: number;
  excerpt: string;        // 1-2 fraze scurte din review
  initials: string;
  fbPermalink: string;    // link direct la recenzie
  fbEmbedSrc: string;     // URL-ul iframe-ului generat de Facebook (post.php?href=...)
};

const embeds: FbEmbed[] = [
  {
    name: "Maria & Alexandru Popescu",
    event: "Review Facebook - Septembrie 2024",
    rating: 5,
    excerpt:
      "DJ Cozo a făcut nunta noastră să fie perfectă! Muzica exact cum ne-am dorit, ringul plin.",
    initials: "MP",
    fbPermalink:
      "https://www.facebook.com/permalink.php?story_fbid=pfbid0s5kHcyHLwPzs8Y4CBKibAmJbm84oHx9FyfnrsAV45mEe8A5JfpoU8aAYFvK1b5pul&id=100085050131486",
    fbEmbedSrc:
      "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0s5kHcyHLwPzs8Y4CBKibAmJbm84oHx9FyfnrsAV45mEe8A5JfpoU8aAYFvK1b5pul%26id%3D100085050131486&show_text=true&width=500",
  },
  // adaugi aici celelalte iframe-uri generate de FB în același format
];

const Testimonials = () => {
  // poți porni cu „ascuns" și la click pe „Vezi dovada pe Facebook" să arăți iframe-ul
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="testimoniale" className="section-spacing bg-gradient-to-b from-background to-secondary/20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="neon-border text-primary mb-4">
            Ce Spun Clienții
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">Experiențe</span> Autentice
          </h2>
          <p className="text-lg text-muted-foreground">
            Carduri în stilul site-ului + dovadă oficială din Facebook.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {embeds.map((t, index) => (
            <Card
              key={index}
              className="group bg-card/50 border-border/50 hover:neon-border smooth-transition p-6 relative overflow-hidden"
            >
              {/* Quote */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex space-x-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Excerpt */}
              <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                "{t.excerpt}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                  <span className="text-sm font-bold text-background">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.event}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-8">
                <button
                  className="text-sm text-primary hover:underline inline-flex items-center gap-2"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  {openIndex === index ? "Ascunde dovada" : "Vezi dovada (Facebook)"} <ExternalLink className="w-4 h-4" />
                </button>
                <a
                  href={t.fbPermalink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Deschide pe Facebook
                </a>
              </div>

              {/* Embed FB în același card, cu „ramă" ta */}
              {openIndex === index && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border/60 bg-background/40">
                  <div className="relative" style={{ aspectRatio: "16/9" }}>
                    <iframe
                      src={t.fbEmbedSrc}
                      title={`fb-embed-${index}`}
                      loading="lazy"
                      scrolling="no"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      style={{
                        border: "0",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 smooth-transition pointer-events-none" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;