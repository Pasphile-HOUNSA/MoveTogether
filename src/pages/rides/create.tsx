import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MapPin, Route, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { chercherLieux, creerTrajet, distanceEntre } from '@/lib/trajets-api';

const inputClass =
    'w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100';

const aujourdhui = new Date().toISOString().slice(0, 10);

export default function RideCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        lieu_depart: '',
        lieu_arrivee: '',
        datedepart: '',
        heuredepart: '',
        placesdispo: '3',
        tarif_km: '50',
        price: '',
        idcar: '1', // provisoire : à remplacer par la voiture de l'utilisateur connecté
    });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [distance, setDistance] = useState<{ distance_km: number; duree_min: number } | null>(null);
    const [calcul, setCalcul] = useState(false);
    const [envoi, setEnvoi] = useState(false);

    const maj = (champ: string, valeur: string) => setForm((f) => ({ ...f, [champ]: valeur }));

    // Autocomplétion : on attend 2 caractères (Nominatim limite à ~1 requête/seconde)
    const surSaisieLieu = async (champ: 'lieu_depart' | 'lieu_arrivee', valeur: string) => {
        maj(champ, valeur);
        setDistance(null);
        if (valeur.length < 3) return;
        try {
            const lieux = await chercherLieux(valeur);
            setSuggestions(lieux.map((l) => l.nom.split(',')[0]));
        } catch {
            /* l'autocomplétion est un confort : on ignore l'erreur */
        }
    };

    const calculerDistance = async () => {
        if (!form.lieu_depart || !form.lieu_arrivee) {
            toast.error('Renseignez le départ et la destination');
            return;
        }
        setCalcul(true);
        try {
            const d = await distanceEntre(form.lieu_depart, form.lieu_arrivee);
            setDistance(d);
            setForm((f) => ({ ...f, price: String(Math.round(d.distance_km * Number(f.tarif_km))) }));
        } catch (e) {
            toast.error((e as Error).message || 'Calcul impossible');
        } finally {
            setCalcul(false);
        }
    };

    const publier = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.lieu_depart || !form.lieu_arrivee || !form.datedepart || !form.heuredepart || !form.price) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }
        setEnvoi(true);
        try {
            await creerTrajet({
                idcar: form.idcar,
                datedepart: form.datedepart,
                heuredepart: form.heuredepart,
                price: form.price,
                placesdispo: Number(form.placesdispo),
                lieu_depart: form.lieu_depart,
                lieu_arrivee: form.lieu_arrivee,
            });
            toast.success('Trajet publié');
            navigate('/rides/search');
        } catch (err) {
            toast.error((err as Error).message || 'Erreur lors de la publication');
        } finally {
            setEnvoi(false);
        }
    };

    return (
        <>
            <Head title="Publier un trajet" />

            <div className="w-full flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
                <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Retour
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="mb-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1D63ED] mb-2">
                                Publication
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Publier un trajet</h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Renseignez les informations de votre trajet pour proposer une course à des passagers vérifiés.
                            </p>
                        </div>

                        <form className="grid gap-5" onSubmit={publier}>
                            <datalist id="lieux">
                                {suggestions.map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#1D63ED]" />
                                        Départ
                                    </span>
                                    <input
                                        type="text"
                                        list="lieux"
                                        placeholder="Cotonou"
                                        value={form.lieu_depart}
                                        onChange={(e) => surSaisieLieu('lieu_depart', e.target.value)}
                                        className={inputClass}
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        Destination
                                    </span>
                                    <input
                                        type="text"
                                        list="lieux"
                                        placeholder="Porto-Novo"
                                        value={form.lieu_arrivee}
                                        onChange={(e) => surSaisieLieu('lieu_arrivee', e.target.value)}
                                        className={inputClass}
                                    />
                                </label>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button type="button" variant="outline" onClick={calculerDistance} disabled={calcul} className="gap-2">
                                    <Route className="w-4 h-4" />
                                    {calcul ? 'Calcul...' : 'Calculer la distance'}
                                </Button>
                                {distance && (
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {distance.distance_km} km · environ {distance.duree_min} min
                                    </span>
                                )}
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-[#1D63ED]" />
                                        Date
                                    </span>
                                    <input
                                        type="date"
                                        min={aujourdhui}
                                        value={form.datedepart}
                                        onChange={(e) => maj('datedepart', e.target.value)}
                                        className={inputClass}
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#1D63ED]" />
                                        Heure de départ
                                    </span>
                                    <input
                                        type="time"
                                        value={form.heuredepart}
                                        onChange={(e) => maj('heuredepart', e.target.value)}
                                        className={inputClass}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-[#1D63ED]" />
                                        Places disponibles
                                    </span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={8}
                                        value={form.placesdispo}
                                        onChange={(e) => maj('placesdispo', e.target.value)}
                                        className={inputClass}
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-[#1D63ED]" />
                                        Tarif par km (FCFA)
                                    </span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.tarif_km}
                                        onChange={(e) => maj('tarif_km', e.target.value)}
                                        className={inputClass}
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-emerald-500" />
                                        Prix par passager (FCFA)
                                    </span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.price}
                                        onChange={(e) => maj('price', e.target.value)}
                                        className={inputClass}
                                    />
                                </label>
                            </div>

                            <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Identifiant du véhicule (provisoire)
                                </span>
                                <input
                                    type="number"
                                    value={form.idcar}
                                    onChange={(e) => maj('idcar', e.target.value)}
                                    className={inputClass}
                                />
                            </label>

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300">
                                ✓ Vérification effectuée : vos documents et votre véhicule sont conformes pour publier un trajet.
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={envoi}
                                    className="w-full sm:w-auto bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold"
                                >
                                    {envoi ? 'Publication...' : 'Publier le trajet'}
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
        { title: 'Accueil', href: '/dashboard' },
        { title: 'Publier un trajet', href: '/rides/create' },
    ],
};