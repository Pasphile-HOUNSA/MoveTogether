import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { CarData } from '@/types/car';
import CarFormHeader from '@/components/car/carFormHeader';
import CarFormFields from '@/components/car/carFormFields';
import CarFormActions from '@/components/car/carFormActions';

type CarFormProps = {
    initialData?: CarData | null;
    mode?: 'add' | 'edit';
    onCancel?: () => void;
};

type CarFormData = {
    type: string;
    mark: string;
    model: string;
    registration_number: string;
    nbr_places: number;
    color: string;
    carte_grise_numero: string;
    carte_grise_scan: File | null;
    assurance_numero: string;
    assurance_expiration: string;
};

export default function CarForm({
    initialData = null,
    mode = 'add',
    onCancel,
}: CarFormProps) {
    const { data, setData, processing, errors, post, put } = useForm<CarFormData>({
        type: initialData?.type || 'Voiture',
        mark: initialData?.mark || '',
        model: initialData?.model || '',
        registration_number: initialData?.registrationNumber || initialData?.registration_number || '',
        nbr_places: initialData?.nbrPlaces || initialData?.nbr_places || 4,
        color: initialData?.color || '',
        carte_grise_numero: initialData?.carte_grise_numero || '',
        carte_grise_scan: null,
        assurance_numero: initialData?.assurance_numero || '',
        assurance_expiration: initialData?.assurance_expiration || '',
    });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setData({
                type: initialData.type || 'Voiture',
                mark: initialData.mark || '',
                model: initialData.model || '',
                registration_number: initialData.registrationNumber || initialData?.registration_number || '',
                nbr_places: initialData.nbrPlaces || initialData?.nbr_places || 4,
                color: initialData.color || '',
                carte_grise_numero: initialData.carte_grise_numero || '',
                carte_grise_scan: null,
                assurance_numero: initialData.assurance_numero || '',
                assurance_expiration: initialData.assurance_expiration || '',
            });
        }
    }, [mode, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && initialData?.idCar) {
            put(`/cars/${initialData.idCar}`, {
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            post('/cars', {
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl dark:border-slate-800 p-6 sm:p-8 max-w-xl mx-auto">
            <CarFormHeader mode={mode} />

            <form onSubmit={handleSubmit} className="space-y-5">
                <CarFormFields
                    type={data.type}
                    setType={(value) => setData('type', value)}
                    mark={data.mark}
                    setMark={(value) => setData('mark', value)}
                    model={data.model}
                    setModel={(value) => setData('model', value)}
                    registrationNumber={data.registration_number}
                    setRegistrationNumber={(value) => setData('registration_number', value)}
                    nbrPlaces={data.nbr_places}
                    setNbrPlaces={(value) => setData('nbr_places', value)}
                    color={data.color}
                    setColor={(value) => setData('color', value)}
                    carteGriseNumero={data.carte_grise_numero}
                    setCarteGriseNumero={(value) => setData('carte_grise_numero', value)}
                    carteGriseScan={data.carte_grise_scan}
                    setCarteGriseScan={(file) => setData('carte_grise_scan', file)}
                    assuranceNumero={data.assurance_numero}
                    setAssuranceNumero={(value) => setData('assurance_numero', value)}
                    assuranceExpiration={data.assurance_expiration}
                    setAssuranceExpiration={(value) => setData('assurance_expiration', value)}
                    errors={errors}
                />

                <CarFormActions
                    processing={processing}
                    onCancel={onCancel}
                />
            </form>
        </div>
    );
}
