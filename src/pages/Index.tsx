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
        <title>DJ Cozo | DJ Nuntă Iași - Pachete și Prețuri DJ Evenimente</title>
        <meta
          name="description"
          content="DJ Cozo - DJ profesionist în Iași. Vezi pachetele și prețurile pentru DJ nuntă, evenimente corporate, petreceri private și cluburi. Experiență 12+ ani. Cere ofertă!"
        />
        <link rel="canonical" href="https://dj-cozo.ro/" />
        <meta property="og:title" content="DJ Cozo | DJ Nuntă Iași - Pachete și Prețuri DJ Evenimente" />
        <meta
          property="og:description"
          content="DJ Cozo - DJ profesionist în Iași. Vezi pachetele și prețurile pentru DJ nuntă, evenimente corporate, petreceri private și cluburi. Experiență 12+ ani. Cere ofertă!"
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
