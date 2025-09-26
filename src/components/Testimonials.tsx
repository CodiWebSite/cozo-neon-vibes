import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const DARKEN_IFRAME = true; // setează false și folosește varianta cu invert/filter (experimental)

const fbReviews = [
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0yQ9WNA4KTXeNy7CjPjtXb4p5WPpme37rejEuoXDmWvVAdJVECaeCqh4gAdTpdWwKl%26id%3D100006627706575&show_text=true&width=500",
    permalink: "https://www.facebook.com/permalink.php?story_fbid=pfbid0yQ9WNA4KTXeNy7CjPjtXb4p5WPpme37rejEuoXDmWvVAdJVECaeCqh4gAdTpdWwKl&id=100006627706575" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fatofanei.andreea%2Fposts%2Fpfbid0aWv998mGyymkfdEABuBxe3xZYPvYM5YVrbG1EEuV7fW5RLNdSuiJxMWjCh1sVcJul&show_text=true&width=500",
    permalink: "https://www.facebook.com/atofanei.andreea/posts/pfbid0aWv998mGyymkfdEABuBxe3xZYPvYM5YVrbG1EEuV7fW5RLNdSuiJxMWjCh1sVcJul" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsorina.calinescu%2Fposts%2Fpfbid09nYwPJ5Kn6Kbbpxa3FQdP9fQib6QDAwmDTXWcJSTF3NN1jzrWx7eQQxmtcviYXG5l&show_text=true&width=500",
    permalink: "https://www.facebook.com/sorina.calinescu/posts/pfbid09nYwPJ5Kn6Kbbpxa3FQdP9fQib6QDAwmDTXWcJSTF3NN1jzrWx7eQQxmtcviYXG5l" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLucian.wfy%2Fposts%2Fpfbid02W9f5Wgzepe2GWWHZdyZdL4aM4vW2VqQNdf1wDhAiwmvgMGc7jBBpuRXsTsUDk6h3l&show_text=true&width=500",
    permalink: "https://www.facebook.com/Lucian.wfy/posts/pfbid02W9f5Wgzepe2GWWHZdyZdL4aM4vW2VqQNdf1wDhAiwmvgMGc7jBBpuRXsTsUDk6h3l" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0NSzLkEfh4ibXcRx2xdwNjL6FvzV3ja14fARc1gdrpGNxJ49ErhQGwNYrWream4rzl%26id%3D100078346758564&show_text=true&width=500",
    permalink: "https://www.facebook.com/permalink.php?story_fbid=pfbid0NSzLkEfh4ibXcRx2xdwNjL6FvzV3ja14fARc1gdrpGNxJ49ErhQGwNYrWream4rzl&id=100078346758564" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0xM2sAVYrK4g4pDV8LC7tNoucVfrP2KdZijdVjQMBHh4orKn12xV67rKYmroUwS5l%26id%3D100073311492127&show_text=true&width=500",
    permalink: "https://www.facebook.com/permalink.php?story_fbid=pfbid0xM2sAVYrK4g4pDV8LC7tNoucVfrP2KdZijdVjQMBHh4orKn12xV67rKYmroUwS5l&id=100073311492127" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fdenisa.rascanu.5%2Fposts%2Fpfbid0pjzvEHnapHeUKH6cUA7s8SBsXn1kaNV7wdsanthLSoG5J8hwM2Xn1oNxUTbWFtAAl&show_text=true&width=500",
    permalink: "https://www.facebook.com/denisa.rascanu.5/posts/pfbid0pjzvEHnapHeUKH6cUA7s8SBsXn1kaNV7wdsanthLSoG5J8hwM2Xn1oNxUTbWFtAAl" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid02Aww577r79ctUXsfRst3h9yjcaGBmYswbCwmu6Uc2YXnvXjgAp6yEzhqqQgpHcVv9l%26id%3D100008501984205&show_text=true&width=500",
    permalink: "https://www.facebook.com/permalink.php?story_fbid=pfbid02Aww577r79ctUXsfRst3h9yjcaGBmYswbCwmu6Uc2YXnvXjgAp6yEzhqqQgpHcVv9l&id=100008501984205" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0Xj4spnFH99wdurGyPVjqoTHKi1ZtTcsngtvQdM9jwakjA2BtZkUzoTHGNfUb1w1cl%26id%3D61560298405537&show_text=true&width=500",
    permalink: "https://www.facebook.com/permalink.php?story_fbid=pfbid0Xj4spnFH99wdurGyPVjqoTHKi1ZtTcsngtvQdM9jwakjA2BtZkUzoTHGNfUb1w1cl&id=61560298405537" },
  { src: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Falex.p.a19%2Fposts%2Fpfbid02qkyKUWSihqtzMXADQVMwFuTwy6YDcAfXXi4az8EbUK9XC5i1Pw58k26JE2RxGf4bl&show_text=true&width=500",
    permalink: "https://www.facebook.com/alex.p.a19/posts/pfbid02qkyKUWSihqtzMXADQVMwFuTwy6YDcAfXXi4az8EbUK9XC5i1Pw58k26JE2RxGf4bl" },
];

const IFrameBox = ({ src }: { src: string }) => {
  // varianta „dark": overlay peste iframe
  if (DARKEN_IFRAME) {
    return (
      <div className="relative aspect-[16/9] w-full">
        <iframe
          src={src}
          loading="lazy"
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="fb-review"
          className="w-full h-full"
          style={{ border: 0 }}
        />
        {/* overlay care „întunecă" fundalul alb */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      </div>
    );
  }

  // varianta „invert" (experimental)
  return (
    <div className="relative aspect-[16/9] w-full">
      <iframe
        src={src}
        loading="lazy"
        scrolling="no"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="fb-review"
        className="w-full h-full"
        style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg) contrast(0.95)" }}
      />
    </div>
  );
};

const Testimonials = () => {
  // Recenzii reale de pe Facebook
  const testimonials = [
    {
      name: "Medeea Buta",
      role: "Majorat",
      content: "Am avut parte de un majorat absolut reușit, iar o mare parte din merit i se datorează DJ-ului! Atmosfera a fost super bine întreținută, iar colegii mei au avut numai cuvinte de laudă. Mi-a plăcut foarte mult cum a știut să interacționeze cu invitații, nu a fost genul care doar pune muzică și atât, ci chiar a vorbit cu noi, a făcut glume, a știut exact când să ne cheme pe ringul de dans și cum să ridice vibe-ul.",
      image: "/testimonials/medeea.jpg"
    },
    {
      name: "Irina Alexandra",
      role: "Nuntă",
      content: "Am avut parte de cea mai frumoasa nunta alaturi de DJ Cozo, el a facut toata atmosfera, a tinut invitatii foarte activi pe ringul de dans, muzica foarte bine aleasa, a stiut sa sa se plieze exact pe genul invitatilor nostri. Cel mai important lucru pe care l-am apreciat enorm a fost comunicarea cu el, a facut exact cum am cerut, ba chiar mai mult. Am fost o mireasa extrem de multumita! Recomand din suflet!",
      image: "/testimonials/irina.jpg"
    },
    {
      name: "Malina Ipate",
      role: "Majorat",
      content: "DJ Cozo a fost alegerea perfectă pentru majoratul meu! A creat o atmosferă super energică, cu muzică pe toate gusturile și momente bine gândite pe parcursul serii. A ținut publicul în priză de la început până la final, iar ringul de dans a fost plin tot timpul. A fost atent la preferințele mele, a comunicat bine și s-a adaptat rapid la cerințele invitaților. Profesionalism și distracție garantate!",
      image: "/testimonials/malina.jpg"
    },
    {
      name: "Ștefan Conțu",
      role: "Eveniment privat",
      content: "Am avut parte de o experiență extraordinară datorită lui Cozo! Atmosfera a fost perfecta, muzica atent aleasă pentru fiecare moment al petrecerii. Luminile și efectele speciale au transformat complet spațiul, creând un vibe de club, dar cu o notă elegantă. Ce mi-a plăcut cel mai mult a fost felul în care a simțit publicul — a știut mereu ce să pună ca să țină lumea pe ringul de dans. Îl recomand cu toată încrederea!",
      image: "/testimonials/stefan.jpg"
    }
  ];
  
  return (
    <section id="testimoniale" className="section-spacing bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Ce spun clienții</h2>
          <p className="text-lg text-muted-foreground">Testimoniale reale de la evenimente de neuitat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="italic text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Buton pentru mai multe recenzii */}
        <div className="text-center mt-12">
          <a 
            href="https://www.facebook.com/DJDavidCozo/reviews" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Mai multe recenzii pe Facebook
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;