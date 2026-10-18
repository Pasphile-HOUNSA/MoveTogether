import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RideCreate() {
    return (
        <>
            <Head title="Publier un trajet" />

            <div className="w-full flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
                <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Retour
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="mb-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1D63ED] mb-2">
                                Publication
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Publier un trajet
                            </h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Renseignez les informations de votre trajet pour proposer une course à des passagers vérifiés.
                            </p>
                        </div>

                        <form className="grid gap-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#1D63ED]" />
                                        Départ
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Paris"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        Destination
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Lyon"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-[#1D63ED]" />
                                        Date et heure
                                    </span>
                                    <input
                                        type="datetime-local"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-[#1D63ED]" />
                                        Places disponibles
                                    </span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={8}
                                        defaultValue={3}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </div>

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300">
                                ✓ Vérification effectuée : vos documents et votre véhicule sont conformes pour publier un trajet.
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button type="button" className="w-full sm:w-auto bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold">
                                    Publier le trajet
                                </Button>
                                <Link href="/dashboard" className="w-full sm:w-auto">
                                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                                        Annuler
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

RideCreate.layout = {
    breadcrumbs: [
        {
            title: 'Accueil',
            href: '/dashboard',
        },
        {
            title: 'Publier un trajet',
            href: '/rides/create',
        },
    ],
};
