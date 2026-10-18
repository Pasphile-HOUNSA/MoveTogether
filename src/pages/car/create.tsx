import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CarForm from '@/components/car/carForm';
import CarList from '@/components/car/carList';

interface Car {
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
}

interface Props {
    cars?: Car[];
}

export default function CarCreate({ cars = [] }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);

    const handleEditCar = (car: Car) => {
        setEditingCar(car);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCar(null);
    };

    return (
        <>
            <Head title="Gérer mes véhicules" />

            <div className="w-full flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        Retour
                                    </Button>
                                </Link>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Gérer mes véhicules
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Ajoutez ou modifiez les informations de vos véhicules
                            </p>
                        </div>
                    </div>

                    {/* Liste des voitures existantes */}
                    {cars && cars.length > 0 && (
                        <CarList
                            cars={cars}
                            onEdit={handleEditCar}
                        />
                    )}

                    {/* Formulaire d'ajout ou d'édition de voiture */}
                    {showForm && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                            <CarForm
                                initialData={editingCar}
                                mode={editingCar ? 'edit' : 'add'}
                                onCancel={handleCloseForm}
                            />
                        </div>
                    )}

                    {/* Bouton pour montrer le formulaire */}
                    {!showForm && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center min-h-50">
                            <p className="text-slate-600 dark:text-slate-400 mb-4 text-center">
                                {cars && cars.length > 0
                                    ? 'Vous pouvez ajouter un autre véhicule'
                                    : 'Aucun véhicule enregistré. Commencez par ajouter un véhicule.'}
                            </p>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold"
                            >
                                + Ajouter un véhicule
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// CarCreate.layout = {
//     breadcrumbs: [
//         {
//             title: 'Accueil',
//             href: '/dashboard',
//         },
//         {
//             title: 'Mes véhicules',
//             href: '/cars/create',
//         },
//     ],
// };
