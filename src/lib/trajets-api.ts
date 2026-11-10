const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export interface Trajet {
  idtrajet: string;
  idcar: string;
  datedepart: string;
  heuredepart: string;
  price: string;
  placesdispo: number;
  statut: string;
  lieu_depart: string;
  lieu_arrivee: string;
}

export interface Filtres {
  lieu_depart?: string;
  lieu_arrivee?: string;
  date?: string;
  max_price?: string;
  page?: number;
  limit?: number;
}

async function requete<T>(chemin: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${chemin}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Erreur ${res.status}`);
  }
  return res.json();
}

export const listerTrajets = (f: Filtres = {}) => {
  const params = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.append(k, String(v));
  });
  return requete<{ page: number; limit: number; data: Trajet[] }>(`/trajets?${params}`);
};

export const detailTrajet = (id: string) => requete<Trajet>(`/trajets/${id}`);

export const creerTrajet = (corps: Partial<Trajet>) =>
  requete<Trajet>('/trajets', { method: 'POST', body: JSON.stringify(corps) });

export const modifierTrajet = (id: string, corps: Partial<Trajet>) =>
  requete<Trajet>(`/trajets/${id}`, { method: 'PUT', body: JSON.stringify(corps) });

export const annulerTrajet = (id: string) =>
  requete<{ message: string }>(`/trajets/${id}`, { method: 'DELETE' });

export const chercherLieux = (q: string) =>
  requete<{ nom: string; lat: number; lon: number }[]>(`/lieux/search?q=${encodeURIComponent(q)}`);

export const distanceEntre = (from: string, to: string) =>
  requete<{ distance_km: number; duree_min: number }>(
    `/lieux/distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );

  export interface SerieCreee {
  serie: { idrecurrence: string };
  occurrences_creees: number;
}

export const creerRecurrent = (corps: {
  idcar: string;
  jours_semaine: number[];
  heuredepart: string;
  price: string;
  placesdispo: number;
  lieu_depart: string;
  lieu_arrivee: string;
  date_debut: string;
  date_fin: string;
}) => requete<SerieCreee>('/recurrents', { method: 'POST', body: JSON.stringify(corps) });