// Utilitaire pour l'URL de l'API
// Détection automatique de l'URL selon l'environnement
const getApiUrl = () => {
  // Si on est dans le navigateur et qu'on accède via port-forward
  if (typeof window !== 'undefined') {
    // Utiliser la même origine que la page actuelle mais avec le port 5000
    const currentUrl = window.location.origin;
    if (currentUrl.includes('localhost:3000') || currentUrl.includes('127.0.0.1:3000')) {
      return 'http://localhost:5000';
    }
    if (currentUrl.includes('192.168.49.2:32250')) {
      return 'http://192.168.49.2:32686';
    }
  }
  
  // Fallback vers la variable d'environnement
  return process.env.NEXT_PUBLIC_URL || 'http://localhost:5000';
};

const URL = getApiUrl();

export default URL;