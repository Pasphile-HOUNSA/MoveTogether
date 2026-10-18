import type { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Car,
    FileText,
    ShieldCheck,
    Calendar,
    Upload,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { route } from 'ziggy-js';

interface CarDocFormProps {
    vehicleId?: number;
    initialData?: {
        carte_grise_numero?: string;
        assurance_numero?: string;
        assurance_expiration?: string;
    };
    onSuccess?: () => void;
}

export function CarDocForm({ vehicleId, initialData, onSuccess }: CarDocFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        carte_grise_numero: initialData?.carte_grise_numero || '',
        carte_grise_scan: null as File | null,
        assurance_numero: initialData?.assurance_numero || '',
        assurance_expiration: initialData?.assurance_expiration || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('vehicles.documents.update', { vehicle: vehicleId }), {
            forceFormData: true,
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header du formulaire */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#1D63ED]">
                        <Car className="w-6 h-6" />
                    </div>
                    <h2>Informations du véhicule</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 pl-12">
                    Détails de votre voiture et documents d'assurance
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Carte Grise */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#1D63ED]" /> Carte Grise
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* carte_grise_numero */}
                        <div className="space-y-2">
                            <Label htmlFor="carte_grise_numero" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Numéro de carte grise
                            </Label>
                            <Input
                                id="carte_grise_numero"
                                type="text"
                                placeholder="ex: 123456789012"
                                value={data.carte_grise_numero}
                                onChange={(e) => setData('carte_grise_numero', e.target.value)}
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus-visible:ring-[#1D63ED]"
                            />
                            {errors.carte_grise_numero && (
                                <p className="text-xs text-red-500">{errors.carte_grise_numero}</p>
                            )}
                        </div>

                        {/* carte_grise_scan */}
                        <div className="space-y-2">
                            <Label htmlFor="carte_grise_scan" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Scan de la carte grise (PDF, JPG, PNG)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="carte_grise_scan"
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={(e) => setData('carte_grise_scan', e.target.files ? e.target.files[0] : null)}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="carte_grise_scan"
                                    className="flex items-center justify-between w-full h-10 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:border-[#1D63ED] transition-colors"
                                >
                                    <span className="truncate">
                                        {data.carte_grise_scan ? data.carte_grise_scan.name : 'Téléverser le fichier...'}
                                    </span>
                                    <Upload className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                                </label>
                            </div>
                            {errors.carte_grise_scan && (
                                <p className="text-xs text-red-500">{errors.carte_grise_scan}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 2: Assurance */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Assurance Véhicule
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* assurance_numero */}
                        <div className="space-y-2">
                            <Label htmlFor="assurance_numero" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Numéro d'assurance / Contrat
                            </Label>
                            <Input
                                id="assurance_numero"
                                type="text"
                                placeholder="ex: ASS-987654321"
                                value={data.assurance_numero}
                                onChange={(e) => setData('assurance_numero', e.target.value)}
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus-visible:ring-[#1D63ED]"
                            />
                            {errors.assurance_numero && (
                                <p className="text-xs text-red-500">{errors.assurance_numero}</p>
                            )}
                        </div>

                        {/* assurance_expiration */}
                        <div className="space-y-2">
                            <Label htmlFor="assurance_expiration" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-purple-500" /> Date d'expiration de l'assurance
                            </Label>
                            <Input
                                id="assurance_expiration"
                                type="date"
                                value={data.assurance_expiration}
                                onChange={(e) => setData('assurance_expiration', e.target.value)}
                                className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus-visible:ring-[#1D63ED]"
                            />
                            {errors.assurance_expiration && (
                                <p className="text-xs text-red-500">{errors.assurance_expiration}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold rounded-xl h-11 px-6 gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" /> Enregistrer les documents
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
