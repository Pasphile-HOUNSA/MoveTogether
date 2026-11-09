/**
 * Utilitaire de gestion des fichiers chiffrés MoveTogether
 *
 * Les fichiers sont désormais chiffrés côté backend (AES-256-GCM) avant
 * d'être stockés dans Supabase Storage. Ils ne sont plus accessibles via
 * une URL publique directe. Ce module convertit les chemins sécurisés
 * retournés par l'API en URLs complètes vers l'endpoint de déchiffrement.
 *
 * Rétro-compatibilité : les anciennes URLs Supabase publiques (https://...)
 * continuent de fonctionner sans modification.
 */

import { getStoredToken } from './auth-service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Vérifie si une URL est un chemin sécurisé vers l'API de déchiffrement
 * (chemin relatif retourné par le backend après upload chiffré).
 */
export function isSecureFilePath(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('/api/documents/file/');
}

/**
 * Vérifie si une URL est une ancienne URL publique Supabase (non chiffrée).
 */
export function isPublicSupabaseUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Résout une URL de fichier (sécurisée ou publique) en une URL complète
 * utilisable dans un `<img src>` ou un `<a href>`.
 *
 * - Chemins sécurisés `/api/documents/file/...` → URL complète vers le backend
 * - URLs publiques Supabase `https://...` → retournées telles quelles
 * - null/undefined → null
 */
export function resolveFileUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Ancienne URL publique Supabase — la retourner telle quelle
  if (isPublicSupabaseUrl(url)) {
    return url;
  }

  // Chemin sécurisé vers l'API de déchiffrement
  if (isSecureFilePath(url)) {
    // Construire l'URL complète vers le backend
    // Le chemin est déjà sous la forme /api/documents/file/:bucket/:filePath
    const baseWithoutApi = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${baseWithoutApi}${url}`;
  }

  // Fallback : traiter comme un chemin relatif API
  if (url.startsWith('/')) {
    const baseWithoutApi = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${baseWithoutApi}${url}`;
  }

  return url;
}

/**
 * Résout une URL de fichier sécurisé en ajoutant le token d'authentification.
 * Utilisé pour les <img> src qui ne peuvent pas envoyer d'en-tête Authorization.
 * Retourne une URL avec le token en query parameter.
 */
export function resolveAuthenticatedFileUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Les anciennes URLs publiques Supabase n'ont pas besoin d'auth
  if (isPublicSupabaseUrl(url)) {
    return url;
  }

  const resolvedUrl = resolveFileUrl(url);
  if (!resolvedUrl) return null;

  const token = getStoredToken();
  if (!token) return resolvedUrl;

  // Ajouter le token comme query parameter pour les requêtes <img>
  const separator = resolvedUrl.includes('?') ? '&' : '?';
  return `${resolvedUrl}${separator}token=${encodeURIComponent(token)}`;
}
