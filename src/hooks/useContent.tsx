import React, { useState, useEffect, createContext, useContext } from 'react';
import { Heart, Users, Briefcase, Music, Star, Crown, Zap } from 'lucide-react';

// Tipuri pentru datele site-ului
export interface GalleryImage {
  id: string;
  title: string;
  alt_text: string;
  category: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  gradient: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  features: string[];
  isPopular: boolean;
  icon: string;
  gradient: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  schedule: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

interface SiteDataContextType {
  content: Record<string, string>;
  galleryImages: GalleryImage[];
  services: Service[];
  packages: Package[];
  testimonials: Testimonial[];
  contactInfo: ContactInfo;
  loading: boolean;
  updateGallery: (images: GalleryImage[]) => Promise<void>;
  updateServices: (services: Service[]) => Promise<void>;
  updatePackages: (packages: Package[]) => Promise<void>;
  updateTestimonials: (testimonials: Testimonial[]) => Promise<void>;
  updateContactInfo: (contactInfo: ContactInfo) => Promise<void>;
  refetch: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextType | null>(null);

// Date inițiale pentru site
const initialGalleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'DJ Cozo în acțiune',
    alt_text: 'DJ Cozo mixând la o petrecere',
    category: 'evenimente',
    image_url: '/src/assets/dj-portrait.jpg',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: 'Nuntă de vis',
    alt_text: 'DJ Cozo la o nuntă elegantă',
    category: 'nunti',
    image_url: '/src/assets/wedding-dj.jpg',
    display_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: 'Petrecere corporativă',
    alt_text: 'Eveniment corporate cu DJ Cozo',
    category: 'corporate',
    image_url: '/src/assets/corporate-event.jpg',
    display_order: 3,
    is_active: true
  }
];

const initialServices: Service[] = [
  {
    id: '1',
    title: 'DJ pentru Nunți',
    description: 'Creez atmosfera perfectă pentru ziua voastră specială cu muzică adaptată gusturilor voastre și ale invitaților.',
    features: ['Consultare pre-eveniment', 'Sistem audio profesional', 'Iluminat ambientală', 'Backup echipamente'],
    icon: 'Heart',
    image: '/src/assets/wedding-dj.jpg',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: '2',
    title: 'Evenimente Private',
    description: 'Petreceri private, aniversări și celebrări intime cu muzică personalizată pentru fiecare moment.',
    features: ['Playlist personalizat', 'Echipamente portabile', 'Flexibilitate program', 'Consultare muzicală'],
    icon: 'Users',
    image: '/src/assets/private-party.jpg',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: '3',
    title: 'Evenimente Corporative',
    description: 'Profesionalism și eleganță pentru lansări de produse, conferințe și petreceri corporative.',
    features: ['Echipamente premium', 'Prezentare profesională', 'Coordonare cu organizatorii', 'Backup plan'],
    icon: 'Briefcase',
    image: '/src/assets/corporate-event.jpg',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    id: '4',
    title: 'Club & Evenimente Publice',
    description: 'Energie și ritm pentru cluburi, festivaluri și evenimente publice de amploare.',
    features: ['Mixuri live', 'Interacțiune cu publicul', 'Echipamente club standard', 'Repertoriu extins'],
    icon: 'Music',
    image: '/src/assets/club-night.jpg',
    gradient: 'from-orange-500 to-red-600'
  }
];

const initialPackages: Package[] = [
  {
    id: '1',
    name: 'Pachet Basic',
    description: 'Perfect pentru evenimente mici și intime',
    duration: '4 ore',
    price: '800 RON',
    features: ['DJ profesionist', 'Sistem audio basic', 'Playlist personalizat', 'Consultare pre-eveniment'],
    isPopular: false,
    icon: 'Zap',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: '2',
    name: 'Pachet Premium',
    description: 'Cel mai popular pentru nunți și evenimente mari',
    duration: '6 ore',
    price: '1200 RON',
    features: ['DJ profesionist', 'Sistem audio premium', 'Iluminat ambientală', 'Microfon wireless', 'Backup echipamente', 'Consultare detaliată'],
    isPopular: true,
    icon: 'Star',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: '3',
    name: 'Pachet VIP',
    description: 'Experiența completă pentru evenimente de lux',
    duration: '8 ore',
    price: '1800 RON',
    features: ['DJ profesionist', 'Sistem audio premium', 'Iluminat profesional', 'Efecte speciale', 'Microfoane wireless', 'Backup complet', 'Asistent tehnic', 'Consultare nelimitată'],
    isPopular: false,
    icon: 'Crown',
    gradient: 'from-yellow-500 to-orange-600'
  }
];

const initialTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria și Alexandru',
    role: 'Miri',
    content: 'DJ Cozo a făcut nunta noastră de neuitat! Muzica a fost perfectă și toți invitații au dansat toată noaptea. Profesionist și foarte atent la detalii.'
  },
  {
    id: '2',
    name: 'Ana Popescu',
    role: 'Event Manager',
    content: 'Colaborez cu DJ Cozo de 3 ani pentru evenimente corporative. Întotdeauna profesionist, punctual și cu o selecție muzicală excelentă.'
  },
  {
    id: '3',
    name: 'Mihai Ionescu',
    role: 'Client privat',
    content: 'Pentru aniversarea mea de 40 de ani, DJ Cozo a creat atmosfera perfectă. Muzica a fost exact ce îmi doream și toți prietenii au fost încântați.'
  }
];

const initialContactInfo: ContactInfo = {
  phone: '+40 722 123 456',
  email: 'contact@dj-neonvibes.ro',
  address: 'Strada Exemplu, Nr. 123, București',
  schedule: 'Luni - Vineri: 10:00 - 18:00'
};

// Funcții helper pentru localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const SiteDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Record<string, string>>({});
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);

  // Încărcarea datelor la inițializare
  useEffect(() => {
    const loadData = async () => {
      try {
        // Încărcăm datele din localStorage sau folosim valorile inițiale
        const storedGallery = loadFromLocalStorage('gallery_images', initialGalleryImages);
        const storedServices = loadFromLocalStorage('services', initialServices);
        const storedPackages = loadFromLocalStorage('packages', initialPackages);
        const storedTestimonials = loadFromLocalStorage('testimonials', initialTestimonials);
        const storedContactInfo = loadFromLocalStorage('contact_info', initialContactInfo);

        setGalleryImages(storedGallery);
        setServices(storedServices);
        setPackages(storedPackages);
        setTestimonials(storedTestimonials);
        setContactInfo(storedContactInfo);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateGallery = async (images: GalleryImage[]) => {
    try {
      setGalleryImages(images);
      saveToLocalStorage('gallery_images', images);
    } catch (error) {
      console.error('Error updating gallery:', error);
      throw error;
    }
  };

  const updateServices = async (newServices: Service[]) => {
    try {
      setServices(newServices);
      saveToLocalStorage('services', newServices);
    } catch (error) {
      console.error('Error updating services:', error);
      throw error;
    }
  };

  const updatePackages = async (newPackages: Package[]) => {
    try {
      setPackages(newPackages);
      saveToLocalStorage('packages', newPackages);
    } catch (error) {
      console.error('Error updating packages:', error);
      throw error;
    }
  };

  const updateTestimonials = async (newTestimonials: Testimonial[]) => {
    try {
      setTestimonials(newTestimonials);
      saveToLocalStorage('testimonials', newTestimonials);
    } catch (error) {
      console.error('Error updating testimonials:', error);
      throw error;
    }
  };

  const updateContactInfo = async (newContactInfo: ContactInfo) => {
    try {
      setContactInfo(newContactInfo);
      saveToLocalStorage('contact_info', newContactInfo);
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  };

  const refetch = async () => {
    // Pentru localStorage, nu e nevoie de refetch real, dar păstrăm interfața
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const value: SiteDataContextType = {
    content,
    galleryImages,
    services,
    packages,
    testimonials,
    contactInfo,
    loading,
    updateGallery,
    updateServices,
    updatePackages,
    updateTestimonials,
    updateContactInfo,
    refetch
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useContent must be used within a SiteDataProvider');
  }
  return context;
};