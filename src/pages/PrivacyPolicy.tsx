import React from 'react';
import { ArrowLeft, Shield, FileText, Users, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Înapoi la site
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Politici Legale
            </h1>
            <p className="text-gray-300 text-lg">
              Termeni și condiții, politica de confidențialitate și alte informații legale
            </p>
          </div>

          {/* Navigation */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 mb-8">
            <h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Cuprins
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="#termeni" className="text-gray-300 hover:text-purple-300 transition-colors">
                1. Termeni și Condiții
              </a>
              <a href="#confidentialitate" className="text-gray-300 hover:text-purple-300 transition-colors">
                2. Politica de Confidențialitate
              </a>
              <a href="#cookies" className="text-gray-300 hover:text-purple-300 transition-colors">
                3. Politica de Cookie-uri
              </a>
              <a href="#contact" className="text-gray-300 hover:text-purple-300 transition-colors">
                4. Date de Contact
              </a>
            </div>
          </div>

          {/* Termeni și Condiții */}
          <section id="termeni" className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              1. Termeni și Condiții
            </h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">1.1 Acceptarea Termenilor</h3>
                <p>
                  Prin utilizarea site-ului DJ Cozo și a serviciilor noastre, acceptați în totalitate acești termeni și condiții. 
                  Dacă nu sunteți de acord cu oricare dintre acești termeni, vă rugăm să nu utilizați serviciile noastre.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">1.2 Serviciile Oferite</h3>
                <p>
                  DJ Cozo oferă servicii de divertisment muzical pentru evenimente private și corporative, incluzând:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Servicii DJ pentru nunți</li>
                  <li>Servicii DJ pentru petreceri private</li>
                  <li>Servicii DJ pentru evenimente corporative</li>
                  <li>Servicii DJ pentru cluburi și evenimente nocturne</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">1.3 Rezervări și Plăți</h3>
                <p>
                  Toate rezervările se fac prin contactare directă. Pentru confirmarea unei rezervări este necesar un avans de 50% 
                  din valoarea totală a serviciului. Restul sumei se achită în ziua evenimentului.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">1.4 Anulări</h3>
                <p>
                  Anulările făcute cu mai mult de 30 de zile înainte de eveniment vor fi rambursate 100%. 
                  Anulările făcute cu 15-30 zile înainte vor fi rambursate 50%. 
                  Anulările făcute cu mai puțin de 15 zile nu vor fi rambursate.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">1.5 Responsabilități</h3>
                <p>
                  DJ Cozo se angajează să furnizeze servicii profesionale de calitate. Nu ne asumăm responsabilitatea pentru 
                  întârzieri cauzate de factori externi (trafic, condiții meteorologice extreme, etc.).
                </p>
              </div>
            </div>
          </section>

          {/* Politica de Confidențialitate */}
          <section id="confidentialitate" className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" />
              2. Politica de Confidențialitate
            </h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">2.1 Colectarea Datelor</h3>
                <p>
                  Colectăm următoarele tipuri de informații:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Informații de contact (nume, email, telefon)</li>
                  <li>Detalii despre eveniment (dată, locație, tip eveniment)</li>
                  <li>Preferințe muzicale și cerințe speciale</li>
                  <li>Date de navigare pe site (prin cookies)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">2.2 Utilizarea Datelor</h3>
                <p>
                  Utilizăm datele colectate pentru:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Procesarea și confirmarea rezervărilor</li>
                  <li>Comunicarea cu clienții</li>
                  <li>Personalizarea serviciilor oferite</li>
                  <li>Îmbunătățirea experienței pe site</li>
                  <li>Marketing (doar cu consimțământul explicit)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">2.3 Protecția Datelor</h3>
                <p>
                  Implementăm măsuri de securitate adecvate pentru protejarea datelor personale împotriva accesului neautorizat, 
                  modificării, divulgării sau distrugerii. Datele sunt stocate securizat și accesate doar de personalul autorizat.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">2.4 Partajarea Datelor</h3>
                <p>
                  Nu vindem, închiriem sau partajăm datele personale cu terțe părți, cu excepția cazurilor în care:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Avem consimțământul explicit al clientului</li>
                  <li>Este necesar pentru furnizarea serviciului (ex: locația evenimentului)</li>
                  <li>Este cerut de lege</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">2.5 Drepturile Utilizatorilor</h3>
                <p>
                  Conform GDPR, aveți următoarele drepturi:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Dreptul de acces la datele personale</li>
                  <li>Dreptul de rectificare a datelor incorecte</li>
                  <li>Dreptul de ștergere a datelor</li>
                  <li>Dreptul de restricționare a prelucrării</li>
                  <li>Dreptul la portabilitatea datelor</li>
                  <li>Dreptul de opoziție</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Politica de Cookie-uri */}
          <section id="cookies" className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">3. Politica de Cookie-uri</h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">3.1 Ce sunt Cookie-urile</h3>
                <p>
                  Cookie-urile sunt fișiere mici de text stocate pe dispozitivul dumneavoastră când vizitați site-ul nostru. 
                  Acestea ne ajută să îmbunătățim experiența de navigare și să analizăm traficul pe site.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">3.2 Tipuri de Cookie-uri Utilizate</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Cookie-uri esențiale:</strong> Necesare pentru funcționarea site-ului</li>
                  <li><strong>Cookie-uri de performanță:</strong> Pentru analiza traficului (Google Analytics)</li>
                  <li><strong>Cookie-uri funcționale:</strong> Pentru memorarea preferințelor</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">3.3 Gestionarea Cookie-urilor</h3>
                <p>
                  Puteți controla și șterge cookie-urile prin setările browser-ului dumneavoastră. 
                  Rețineți că dezactivarea cookie-urilor poate afecta funcționalitatea site-ului.
                </p>
              </div>
            </div>
          </section>

          {/* Date de Contact */}
          <section id="contact" className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              4. Date de Contact
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                Pentru întrebări legate de aceste politici sau pentru exercitarea drepturilor dumneavoastră, 
                ne puteți contacta la:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-semibold text-purple-200">Email</p>
                    <p>contact@dj-cozo.ro</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-semibold text-purple-200">Telefon</p>
                    <p>+40 749 800 325</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-semibold text-purple-200">Adresă</p>
                    <p>Iași, România</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-purple-500/20">
            <p className="text-gray-400">
              Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
            </p>
            <p className="text-gray-400 mt-2">
              © 2025 DJ Cozo. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;