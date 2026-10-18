import { router } from '@inertiajs/react';
import { Car as CarIcon, Edit2, Trash2, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Car = {
    id?: number;
    idCar?: number;
    type: string;
    mark: string;
    model: string;
    registration_number?: string;
    registrationNumber?: string;
    nbr_places?: number;
    nbrPlaces?: number;
    color: string;
    carte_grise_numero?: string;
    assurance_numero?: string;
    assurance_expiration?: string;
};

type CarListProps = {
    cars: Car[];
    onEdit?: (car: Car) => void;
};

export default function CarList({ cars = [], onEdit }: CarListProps) {
    const handleDelete = (carId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
            return;
        }

        router.delete(`/cars/${carId}`);
    };

    if (cars.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Mes Véhicules
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Gérez les véhicules que vous utilisez pour covoiturer.
                </p>
            </div>

            {/* Grille de véhicules */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => {
                    const id = car.id || car.idCar || 0;
                    const regNumber = car.registration_number || car.registrationNumber || '';
                    const places = car.nbr_places || car.nbrPlaces || 0;

                    return (
                        <div
                            key={id}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                        >
                            <div className="p-6">
                                {/* Badge & Icône */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        <CarIcon size={20} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 rounded-full px-2.5 py-1">
                                        <Shield size={10} /> Vérifié
                                    </div>
                                </div>

                                {/* Titre & Modèle */}
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {car.mark}{' '}
                                    <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm">
                                        {car.model}
                                    </span>
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">{car.type}</p>

                                {/* Détails du véhicule */}
                                <div className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Plaque :</span>
                                        <span className="font-semibold uppercase text-slate-800 dark:text-slate-200">
                                            {regNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Couleur :</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200">
                                            {car.color}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 flex items-center gap-1">
                                            <Users size={14} /> Places :
                                        </span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {places} places
                                        </span>
                                    </div>
                                    {car.carte_grise_numero && (
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                                            <span className="text-slate-400">Carte grise :</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {car.carte_grise_numero}
                                            </span>
                                        </div>
                                    )}
                                    {car.assurance_numero && (
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                                            <span className="text-slate-400">Assurance :</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {car.assurance_numero}
                                            </span>
                                        </div>
                                    )}
                                    {car.assurance_expiration && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Expiration :</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {car.assurance_expiration}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-slate-50/80 dark:bg-slate-800/40 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit?.(car)}
                                    className="h-9 w-9 text-slate-500 hover:text-[#1D63ED] hover:bg-[#1D63ED]/10"
                                    title="Modifier les détails"
                                >
                                    <Edit2 size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(id)}
                                    className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                    title="Supprimer le véhicule"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
