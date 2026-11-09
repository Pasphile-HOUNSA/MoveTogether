/**
 * Service de gestion des documents et téléversement MoveTogether
 * Intégration Supabase Storage et gestion des statuts (en_attente, valide, refuse, expire).
 */

import { getStoredToken } from './auth-service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DriverDocumentData {
  iddocument?: number;
  numPermis: string;
  permis_expiration: string;
  scanPermis: string | null;
  certificatApt: string;
  certificatApt_scan: string | null;
  statut?: 'en_attente' | 'valide' | 'refuse' | 'expire';
  motif_refus?: string | null;
  valide_le?: string | null;
  isExpired?: boolean;
  daysUntilExpiration?: number | null;
  isComplete?: boolean;
}

export interface IdentityDocumentData {
  numPiece: string | null;
  scanPiece: string | null;
  photoId?: string | null;
  photoIdentite?: string | null;
  statut_piece?: 'en_attente' | 'valide' | 'refuse';
  motif_refus_piece?: string | null;
  isComplete?: boolean;
}

export interface MyDocumentsResponse {
  success: boolean;
  driverDocument: DriverDocumentData | null;
  identityDocument: IdentityDocumentData | null;
  error?: string;
}

/**
 * Téléverse un fichier (scan ou photo) vers Supabase Storage via l'API sécurisée
 */
export async function uploadDocumentFile(
  file: File,
  docType: 'scanpermis' | 'certificatapt_scan' | 'scanpiece' | 'photoid'
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('docType', docType);

  try {
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.fileUrl) {
      return { success: true, fileUrl: data.fileUrl };
    }

    return { success: false, error: data.error || 'Erreur lors du téléversement.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur réseau lors de l\'envoi du fichier.' };
  }
}

/**
 * Récupère les documents et leurs statuts pour l'utilisateur connecté
 */
export async function fetchMyDocuments(): Promise<MyDocumentsResponse> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, driverDocument: null, identityDocument: null, error: 'Non authentifié.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/documents/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        driverDocument: data.driverDocument,
        identityDocument: data.identityDocument,
      };
    }

    return {
      success: false,
      driverDocument: null,
      identityDocument: null,
      error: data.error || 'Impossible de récupérer vos documents.',
    };
  } catch (err: any) {
    return {
      success: false,
      driverDocument: null,
      identityDocument: null,
      error: err.message || 'Erreur réseau.',
    };
  }
}

/**
 * Enregistre ou met à jour les informations et scans du conducteur
 */
export async function saveDriverDocuments(payload: {
  numPermis: string;
  permis_expiration: string;
  scanPermis: string | null;
  certificatApt: string;
  certificatApt_scan: string | null;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Non authentifié.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    }

    return { success: false, error: data.error || 'Erreur lors de l\'enregistrement.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur réseau.' };
  }
}

/**
 * Enregistre la pièce d'identité et la photo de profil
 */
export async function saveIdentityDocuments(payload: {
  numPiece?: string;
  scanPiece?: string | null;
  photoId?: string | null;
  photoIdentite?: string | null;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: 'Non authentifié.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/documents/identity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    }

    return { success: false, error: data.error || 'Erreur lors de l\'enregistrement de la pièce.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur réseau.' };
  }
}
