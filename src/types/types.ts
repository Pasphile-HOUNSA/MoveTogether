export type Trajet = {
    depart: string;
    arrivee: string;
    prix: string;
    duree?: string;
    places?: number;
};

export type Conducteur = {
    nom: string;
    membreDepuis: string;
    note: number;
    trajetsRecents: Array<{
        depart: string;
        arrivee: string;
        date: string;
        prix: string;
    }>;
};
