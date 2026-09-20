import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Packages from '@/components/Packages';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>DJ Cozo | DJ Iași - Nunți, Evenimente Corporate, Petreceri Private</title>
        <meta
          name="description"
          content="DJ Cozo - DJ profesionist în Iași. Servicii DJ pentru nunți, evenimente corporate, petreceri private și cluburi. Echipamente premium, experiență 12+ ani. Rezervă acum!"
        />
        <link rel="canonical" href="https://dj-cozo.ro/" />
        <meta property="og:title" content="DJ Cozo | DJ Iași - Nunți, Evenimente Corporate, Petreceri Private" />
        <meta
          property="og:description"
          content="DJ Cozo - DJ profesionist în Iași. Servicii DJ pentru nunți, evenimente corporate, petreceri private și cluburi. Echipamente premium, experiență 12+ ani."
        />
        <meta property="og:url" content="https://dj-cozo.ro/" />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Packages />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
