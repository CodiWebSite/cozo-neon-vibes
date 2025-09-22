// Datele de autentificare pentru panoul de administrare
// Într-o aplicație reală, aceste date ar trebui stocate într-o bază de date securizată
export const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

// Funcție pentru verificarea credențialelor
export const verifyCredentials = (username: string, password: string): boolean => {
  return username === adminCredentials.username && password === adminCredentials.password;
};