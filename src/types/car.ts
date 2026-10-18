export type CarData = {
    idCar?: number;
    type: string;
    mark: string;
    model: string;
    registrationNumber?: string;
    registration_number?: string;
    nbrPlaces?: number;
    nbr_places?: number;
    color: string;
    carte_grise_numero?: string;
    assurance_numero?: string;
    assurance_expiration?: string;
};

export const CAR_BRANDS = [
    'Audi',
    'BMW',
    'Chevrolet',
    'Citroën',
    'Dacia',
    'Fiat',
    'Ford',
    'Honda',
    'Hyundai',
    'Kia',
    'Mercedes-Benz',
    'Nissan',
    'Peugeot',
    'Renault',
    'Toyota',
    'Volkswagen',
];
