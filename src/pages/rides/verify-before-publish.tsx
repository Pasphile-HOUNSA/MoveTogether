import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    CheckCircle2,
    FileText,
    Car as CarIcon,
    ArrowRight,
    ArrowLeft,
    Loader2,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    fetchCurrentUser,
    becomeDriver,
    isAuthenticated,
    type DriverReadiness,
} from '@/lib/auth-service';

type PageState = 'loading' | 'ready' | 'becoming_driver' | 'error';

export default function VerifyBeforePublish() {
    const navigate = useNavigate();

    const [pageState, setPageState] = useState<PageState>('loading');
    const [driverReady, setDriverReady] = useState<DriverReadiness | null>(null);
    const [isAlreadyDriver, setIsAlreadyDriver] = useState(false);
    const [actionError, setActionError] = useState('');
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        fetchCurrentUser()
            .then((res) => {
                if (res.success && res.user) {
                    setDriverReady(res.user.driverReady || null);
                    setIsAlreadyDriver(res.user.role === 'conducteur');
                    setPageState('ready');
                } else {
                    setFetchError(res.error || 'Impossible de charger vos informations.');
                    setPageState('error');
                }
            })
            .catch(() => {
                setFetchError('Erreur réseau. Vérifiez votre connexion.');
                setPageState('error');
            });
    }, [navigate]);

    const handleBecomeDriver = async () => {
        setActionError('');
        setPageState('becoming_driver');

        const res = await becomeDriver();
        if (res.success) {
            // Rôle conducteur attribué → aller créer le trajet
            navigate('/rides/create', { replace: true });
        } else {
            setActionError(res.error || 'Impossible de devenir conducteur pour l\'instant.');
            setPageState('ready');
        }
    };

    const documentComplete = driverReady?.documentComplete ?? false;
    const carComplete = driverReady?.carComplete ?? false;
    const allComplete = documentComplete && carComplete;

    // ---- États de page ----

    if (pageState === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1D63ED]" />
                    <p className="text-sm font-medium">Chargement de vos informations...</p>
                </div>
            </div>
        );
    }

    if (pageState === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Erreur de chargement</h2>
                    <p className="text-slate-500 text-sm">{fetchError}</p>
                    <Button onClick={() => navigate('/dashboard')} className="bg-[#1D63ED] text-white">
                        Retour au tableau de bord
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Avant de publier un trajet - MoveTogether" />

            <div className="w-full flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 dark:bg-slate-950 min-h-screen">

                <div className="flex">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Retour
                    </Button>
                </div>

                <div className="max-w-2xl mx-auto w-full space-y-6">
                    {/* Titre */}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Avant de publier un trajet
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Pour devenir conducteur sur MoveTogether, vos documents et votre véhicule doivent être enregistrés.
                        </p>
                    </div>

                    {/* Erreur d'action */}
                    {actionError && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{actionError}</AlertDescription>
                        </Alert>
                    )}

                    {/* Badge conducteur déjà attribué */}
                    {isAlreadyDriver && (
                        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            <AlertDescription>
                                Vous avez déjà le rôle <strong>Conducteur</strong>. Vous pouvez publier un trajet directement.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* ===== Documents personnels ===== */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Documents personnels
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                        Permis de conduire et certificat d'aptitude
                                    </p>
                                </div>
                            </div>
                            {documentComplete ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                            )}
                        </div>

                        {documentComplete ? (
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl text-sm mb-4">
                                ✓ Tous vos documents sont à jour et validés
                            </div>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                                <p className="text-amber-900 dark:text-amber-200 text-sm font-medium mb-3">
                                    Documents manquants ou incomplets :
                                </p>
                                <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-300">
                                    {(driverReady?.missingDocFields || []).map((field) => (
                                        <li key={field}>• {fieldLabel(field)}</li>
                                    ))}
                                    {/* Fallback si driverReady n'est pas fourni */}
                                    {!driverReady && (
                                        <>
                                            <li>• Numéro de permis de conduire</li>
                                            <li>• Scan du permis de conduire</li>
                                            <li>• Certificat d'aptitude</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        )}

                        {!documentComplete && (
                            <Button
                                onClick={() => navigate('/settings/documents')}
                                className="w-full bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold"
                            >
                                Compléter mes documents
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>

                    {/* ===== Véhicule ===== */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <CarIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Informations du véhicule
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                        Détails de votre voiture et documents d'assurance
                                    </p>
                                </div>
                            </div>
                            {carComplete ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                            )}
                        </div>

                        {carComplete ? (
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl text-sm mb-4">
                                ✓ Les informations de votre véhicule sont complètes
                            </div>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                                <p className="text-amber-900 dark:text-amber-200 text-sm font-medium mb-3">
                                    Informations manquantes du véhicule :
                                </p>
                                <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-300">
                                    {(driverReady?.missingCarFields || []).map((field) => (
                                        <li key={field}>• {fieldLabel(field)}</li>
                                    ))}
                                    {!driverReady && (
                                        <>
                                            <li>• Marque et modèle de la voiture</li>
                                            <li>• Numéro d'immatriculation</li>
                                            <li>• Carte grise et assurance</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        )}

                        {!carComplete && (
                            <Button
                                onClick={() => navigate('/cars/create')}
                                className="w-full bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold"
                            >
                                Enregistrer mon véhicule
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>

                    {/* ===== Bouton d'action principal ===== */}
                    {isAlreadyDriver ? (
                        // Déjà conducteur → publier directement
                        <Button
                            onClick={() => navigate('/rides/create')}
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg"
                        >
                            Publier un trajet
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    ) : allComplete ? (
                        // Documents + voiture ok → devenir conducteur
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Vous êtes prêt(e) !
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Vos documents et véhicule sont complets. Cliquez pour obtenir le rôle <strong>Conducteur</strong> et publier votre premier trajet.
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleBecomeDriver}
                                disabled={pageState === 'becoming_driver'}
                                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base"
                            >
                                {pageState === 'becoming_driver' ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Activation en cours...
                                    </div>
                                ) : (
                                    <>
                                        Devenir Conducteur et Publier un trajet
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        // Pas encore complet → message informatif
                        <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center text-slate-500 dark:text-slate-400 text-sm">
                            Complétez vos documents et votre véhicule pour débloquer la publication de trajets.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/**
 * Traduit les noms de champs techniques en libellés lisibles
 */
function fieldLabel(field: string): string {
    const labels: Record<string, string> = {
        numpermis: 'Numéro de permis de conduire',
        scanpermis: 'Scan du permis de conduire',
        certificatapt: 'Certificat d\'aptitude médicale',
        certificatapt_scan: 'Scan du certificat d\'aptitude',
        permis_expiration: 'Date d\'expiration du permis',
        mark: 'Marque de la voiture',
        model: 'Modèle de la voiture',
        registrationnumber: 'Numéro d\'immatriculation',
        nbrplaces: 'Nombre de places',
        carte_grise_scan: 'Scan de la carte grise',
        assurance_numero: 'Numéro d\'assurance',
        assurance_expiration: 'Date d\'expiration de l\'assurance',
    };
    return labels[field] || field;
}

VerifyBeforePublish.layout = (page: React.ReactNode) => page;
