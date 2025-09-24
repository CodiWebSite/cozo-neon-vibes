#!/bin/bash

# Script pentru upload site DJ Cozo în folderul beta pe cPanel
# Credențiale FTP: djcozo@ftp.dj-cozo.ro:21

echo "🚀 Începe upload-ul site-ului DJ Cozo în folderul beta..."

# Verifică dacă directorul dist există
if [ ! -d "dist" ]; then
    echo "❌ Eroare: Directorul 'dist' nu există. Rulează 'npm run build' mai întâi."
    exit 1
fi

# Configurare FTP
FTP_HOST="ftp.dj-cozo.ro"
FTP_USER="djcozo"
FTP_PASS='TU1w&^AgOkxN'
FTP_PORT="21"
REMOTE_DIR="beta"

echo "📁 Upload fișiere din directorul 'dist' în '$REMOTE_DIR'..."

# Folosește lftp pentru upload
lftp -c "
set ftp:ssl-allow no
set ftp:passive-mode on
set net:timeout 10
set net:max-retries 3
open -p $FTP_PORT $FTP_HOST
user $FTP_USER '$FTP_PASS'
lcd dist
cd $REMOTE_DIR

# Șterge conținutul existent din directorul beta
echo 'Curăț directorul beta...'
rm -rf *

# Upload toate fișierele și directoarele
echo 'Upload fișiere...'
mirror -R --verbose --delete --parallel=3 ./ ./

# Verifică upload-ul
echo 'Verificare finală...'
ls -la

quit
"

if [ $? -eq 0 ]; then
    echo "✅ Upload finalizat cu succes!"
    echo "🌐 Site-ul este disponibil la: http://dj-cozo.ro/beta/"
    echo ""
    echo "📋 Fișiere încărcate:"
    echo "   - index.html (pagina principală)"
    echo "   - assets/ (CSS, JS, imagini)"
    echo "   - uploads/ (galeria de imagini)"
    echo "   - favicon.ico, robots.txt, etc."
else
    echo "❌ Eroare la upload. Verifică credențialele și conexiunea."
    exit 1
fi