import { CarFront } from 'lucide-react';

type CarFormHeaderProps = {
    mode: 'add' | 'edit';
};

export default function CarFormHeader({ mode }: CarFormHeaderProps) {
    return (
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-14 h-10 rounded-xl bg-[#1D63ED]/10 flex items-center justify-center text-[#1D63ED]">
                <CarFront size={20} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {mode === 'edit' ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {mode === 'edit'
                        ? 'Mettez à jour les informations de votre véhicule.'
                        : 'Enregistrez votre véhicule pour commencer à proposer des trajets.'}
                </p>
            </div>
        </div>
    );
}
