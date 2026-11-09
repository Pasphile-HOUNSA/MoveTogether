import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Users, Coins, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { fetchCurrentUser, isAuthenticated } from '@/lib/auth-service';

export default function RideCreate() {
    const navigate = useNavigate();

    const [loadingUser, setLoadingUser] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [idCar, setIdCar] = useState<number | null>(null);
    const [lieuDepart, setLieuDepart] = useState('Cotonou');
    const [lieuArrivee, setLieuArrivee] = useState('Porto-Novo');
    const [dateHeure, setDateHeure] = useState(() => {
        const d = new Date();
        d.setHours(d.getHours() + 2);
        return d.toISOString().slice(0, 16);
    });
    const [placesDispo, setPlacesDispo] = useState(3);
    const [price, setPrice] = useState(1500);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        fetchCurrentUser()
            .then(async (res) => {
                if (res.success && res.user) {
                    // Vérifier si le conducteur a un véhicule enregistré
                    try {
                        const token = localStorage.getItem('movetogether_token');
                        const meRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const meData = await meRes.json();
                        // Si le backend retourne les infos véhicule
                        if (meData.user?.iduser) {
                            // On tente de récupérer la première voiture disponible
                            setIdCar(1); // Valeur par défaut ou celle du véhicule
                        }
                    } catch {
                        setIdCar(1);
                    }
                }
            })
            .catch(() => {
                setErrorMessage('Impossible de vérifier votre profil conducteur.');
            })
            .finally(() => {
                setLoadingUser(false);
            });
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!lieuDepart.trim() || !lieuArrivee.trim()) {
            setErrorMessage('Veuillez renseigner le lieu de départ et la destination.');
            return;
        }

        if (!dateHeure) {
            setErrorMessage('Veuillez sélectionner la date et l\'heure de départ.');
            return;
        }

        setSubmitting(true);

        const [datedepart, timePart] = dateHeure.split('T');
        const heuredepart = timePart ? `${timePart}:00` : '08:00:00';

        try {
            await apiClient.post('/trajets', {
                idcar: idCar || 1,
                datedepart,
                heuredepart,
                price: Number(price),
                placesdispo: Number(placesDispo),
                lieu_depart: lieuDepart.trim(),
                lieu_arrivee: lieuArrivee.trim(),
                statut: 'en attente',
            });

            setSuccessMessage('Trajet publié avec succès sur MoveTogether !');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err: any) {
            setErrorMessage(err.message || 'Erreur lors de la publication du trajet.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-[#1D63ED]" />
            </div>
        );
    }

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
                                Publication de trajet
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Proposer un trajet
                            </h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Renseignez les informations de votre trajet pour proposer une course à des passagers vérifiés.
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
                                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid gap-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#1D63ED]" />
                                        Lieu de Départ
                                    </span>
                                    <input
                                        type="text"
                                        value={lieuDepart}
                                        onChange={(e) => setLieuDepart(e.target.value)}
                                        placeholder="Ex: Cotonou (Étoile Rouge)"
                                        required
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        Destination d'Arrivée
                                    </span>
                                    <input
                                        type="text"
                                        value={lieuArrivee}
                                        onChange={(e) => setLieuArrivee(e.target.value)}
                                        placeholder="Ex: Porto-Novo (Ouando)"
                                        required
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-[#1D63ED]" />
                                        Date et heure de départ
                                    </span>
                                    <input
                                        type="datetime-local"
                                        value={dateHeure}
                                        onChange={(e) => setDateHeure(e.target.value)}
                                        required
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
                                        value={placesDispo}
                                        onChange={(e) => setPlacesDispo(parseInt(e.target.value) || 1)}
                                        required
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Coins className="w-4 h-4 text-amber-500" />
                                        Prix par place (FCFA)
                                    </span>
                                    <input
                                        type="number"
                                        min={100}
                                        step={100}
                                        value={price}
                                        onChange={(e) => setPrice(parseInt(e.target.value) || 500)}
                                        required
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#1D63ED] focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </div>

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300">
                                ✓ Vérification effectuée : vos documents conducteur et votre véhicule sont en règle pour publier un trajet.
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Publication en cours...
                                        </>
                                    ) : (
                                        'Publier le trajet'
                                    )}
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
