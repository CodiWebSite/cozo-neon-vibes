import { Card } from "@/components/ui/card";
// dacă vrei badge sus, decomentează următoarea linie
// import { Badge } from "@/components/ui/badge";

const fbReviews = [
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0yQ9WNA4KTXeNy7CjPjtXb4p5WPpme37rejEuoXDmWvVAdJVECaeCqh4gAdTpdWwKl%26id%3D100006627706575&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/permalink.php?story_fbid=pfbid0yQ9WNA4KTXeNy7CjPjtXb4p5WPpme37rejEuoXDmWvVAdJVECaeCqh4gAdTpdWwKl&id=100006627706575",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fatofanei.andreea%2Fposts%2Fpfbid0aWv998mGyymkfdEABuBxe3xZYPvYM5YVrbG1EEuV7fW5RLNdSuiJxMWjCh1sVcJul&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/atofanei.andreea/posts/pfbid0aWv998mGyymkfdEABuBxe3xZYPvYM5YVrbG1EEuV7fW5RLNdSuiJxMWjCh1sVcJul",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsorina.calinescu%2Fposts%2Fpfbid09nYwPJ5Kn6Kbbpxa3FQdP9fQib6QDAwmDTXWcJSTF3NN1jzrWx7eQQxmtcviYXG5l&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/sorina.calinescu/posts/pfbid09nYwPJ5Kn6Kbbpxa3FQdP9fQib6QDAwmDTXWcJSTF3NN1jzrWx7eQQxmtcviYXG5l",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLucian.wfy%2Fposts%2Fpfbid02W9f5Wgzepe2GWWHZdyZdL4aM4vW2VqQNdf1wDhAiwmvgMGc7jBBpuRXsTsUDk6h3l&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/Lucian.wfy/posts/pfbid02W9f5Wgzepe2GWWHZdyZdL4aM4vW2VqQNdf1wDhAiwmvgMGc7jBBpuRXsTsUDk6h3l",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0NSzLkEfh4ibXcRx2xdwNjL6FvzV3ja14fARc1gdrpGNxJ49ErhQGwNYrWream4rzl%26id%3D100078346758564&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/permalink.php?story_fbid=pfbid0NSzLkEfh4ibXcRx2xdwNjL6FvzV3ja14fARc1gdrpGNxJ49ErhQGwNYrWream4rzl&id=100078346758564",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0xM2sAVYrK4g4pDV8LC7tNoucVfrP2KdZijdVjQMBHh4orKn12xV67rKYmroUwS5l%26id%3D100073311492127&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/permalink.php?story_fbid=pfbid0xM2sAVYrK4g4pDV8LC7tNoucVfrP2KdZijdVjQMBHh4orKn12xV67rKYmroUwS5l&id=100073311492127",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fdenisa.rascanu.5%2Fposts%2Fpfbid0pjzvEHnapHeUKH6cUA7s8SBsXn1kaNV7wdsanthLSoG5J8hwM2Xn1oNxUTbWFtAAl&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/denisa.rascanu.5/posts/pfbid0pjzvEHnapHeUKH6cUA7s8SBsXn1kaNV7wdsanthLSoG5J8hwM2Xn1oNxUTbWFtAAl",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid02Aww577r79ctUXsfRst3h9yjcaGBmYswbCwmu6Uc2YXnvXjgAp6yEzhqqQgpHcVv9l%26id%3D100008501984205&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/permalink.php?story_fbid=pfbid02Aww577r79ctUXsfRst3h9yjcaGBmYswbCwmu6Uc2YXnvXjgAp6yEzhqqQgpHcVv9l&id=100008501984205",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0Xj4spnFH99wdurGyPVjqoTHKi1ZtTcsngtvQdM9jwakjA2BtZkUzoTHGNfUb1w1cl%26id%3D61560298405537&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/permalink.php?story_fbid=pfbid0Xj4spnFH99wdurGyPVjqoTHKi1ZtTcsngtvQdM9jwakjA2BtZkUzoTHGNfUb1w1cl&id=61560298405537",
  },
  {
    src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Falex.p.a19%2Fposts%2Fpfbid02qkyKUWSihqtzMXADQVMwFuTwy6YDcAfXXi4az8EbUK9XC5i1Pw58k26JE2RxGf4bl&show_text=true&width=500",
    permalink:
      "https://www.facebook.com/alex.p.a19/posts/pfbid02qkyKUWSihqtzMXADQVMwFuTwy6YDcAfXXi4az8EbUK9XC5i1Pw58k26JE2RxGf4bl",
  },
];

const Testimonials = () => {
  return (
    <section id="testimoniale" className="section-spacing bg-gradient-to-b from-background to-secondary/20">
      <div className="container-custom">
        {/* Header scurt, fără explicații */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* <Badge variant="outline" className="neon-border text-primary mb-3">Ce spun clienții</Badge> */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            <span className="gradient-text">Recenzii</span> de pe Facebook
          </h2>
        </div>

        {/* Grid cu iframes, încadrate în cardurile tale */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fbReviews.map((item, i) => (
            <Card
              key={i}
              className="bg-card/50 border-border/50 hover:neon-border smooth-transition p-0 overflow-hidden"
            >
              <div className="relative aspect-[16/9] w-full">
                <iframe
                  src={item.src}
                  title={`fb-review-${i}`}
                  loading="lazy"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  style={{ border: 0, width: "100%", height: "100%", overflow: "hidden" }}
                />
              </div>

              {/* link discret către postarea FB (opțional) */}
              <div className="px-4 py-3 border-t border-border/60 flex justify-end">
                <a
                  href={item.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                >
                  Deschide postarea
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA „Vezi mai multe" */}
        <div className="text-center mt-12">
          <a
            href="https://www.facebook.com/DJDavidCozo/reviews"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-5 py-3 rounded-lg border border-border/60 hover:border-primary smooth-transition"
          >
            Vezi mai multe review-uri
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;