# Instrucțiuni Deployment cPanel

## Pregătire pentru deployment

Proiectul a fost optimizat și este gata pentru deployment pe cPanel. Toate referințele la Supabase au fost eliminate și înlocuite cu localStorage pentru persistența datelor.

## Pași pentru deployment

### 1. Build-ul este gata
Directorul `dist/` conține toate fișierele necesare pentru deployment:
- `index.html` - fișierul principal
- `assets/` - CSS, JavaScript și imagini optimizate
- `.htaccess` - configurare pentru rutele SPA
- `favicon.ico`, `robots.txt` - fișiere auxiliare

### 2. Upload pe cPanel
1. Accesează File Manager în cPanel
2. Navighează la directorul `public_html` (sau subdirectorul dorit)
3. Șterge conținutul existent (dacă este necesar)
4. Upload toate fișierele din directorul `dist/`
5. Asigură-te că fișierul `.htaccess` este prezent și vizibil

### 3. Configurare domeniu
- Dacă folosești un subdomeniu, asigură-te că pointează către directorul corect
- Verifică că toate permisiunile sunt setate corect (644 pentru fișiere, 755 pentru directoare)

### 4. Testare
După upload, testează:
- Pagina principală se încarcă corect
- Toate rutele funcționează (`/admin`, `/admin/login`)
- Imaginile se afișează corect
- Panoul admin funcționează (credențiale: admin/admin123)

## Funcționalități

### Frontend
- Site responsive cu design modern
- Galerie de imagini
- Secțiuni: Hero, About, Services, Packages, Testimonials, Contact
- Animații și efecte vizuale

### Panoul Admin
- Login securizat (admin/admin123)
- Editare conținut site
- Gestionare galerie imagini
- Editare servicii și pachete
- Gestionare testimoniale
- Persistența datelor în localStorage

## Tehnologii folosite
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Shadcn/ui components
- Lucide React (iconuri)
- React Router (navigare)

## Notă importantă
Datele sunt stocate în localStorage, ceea ce înseamnă că:
- Datele sunt specifice browser-ului
- Se păstrează între sesiuni
- Nu se sincronizează între dispozitive
- Pentru o soluție de producție, recomandăm integrarea cu o bază de date

## Suport
Pentru probleme sau întrebări, contactează echipa de dezvoltare.