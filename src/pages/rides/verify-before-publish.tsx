import { Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, FileText, Car as CarIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    documentComplete: boolean;
    document: any;
    carComplete: boolean;
    car: any;
}

export default function VerifyBeforePublish({ documentComplete, document, carComplete, car }: Props) {
    return (
        <>
            <Head title="Vérifier vos informations" />

            <div className="w-full flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 dark:bg-slate-950 min-h-screen">

                <div className="flex">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft />
                        Retour
                    </Button>
                </div>
                
                <div className="max-w-2xl mx-auto w-full">
                    {/* Titre */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Avant de publier un trajet
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Pour publier un trajet, nous avons besoin que vos informations soient à jour.
                        </p>
                    </div>

                    {/* Vérification Documents */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-sm">
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
                                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                                    {!document?.numPermis && <li>• Numéro de permis de conduire</li>}
                                    {!document?.scanPermis && <li>• Scan du permis de conduire</li>}
                                    {!document?.certificatApt && <li>• Certificat d'aptitude</li>}
                                    {!document?.certificatApt_scan && <li>• Scan du certificat d'aptitude</li>}
                                </ul>
                            </div>
                        )}

                        {!documentComplete && (
                            <Link href="/settings/documents" className="block">
                                <Button className="w-full bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold">
                                    Compléter mes documents
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Vérification Voiture */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-sm">
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
                                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                                    {!car?.mark && <li>• Marque de la voiture</li>}
                                    {!car?.model && <li>• Modèle de la voiture</li>}
                                    {!car?.registrationNumber && <li>• Numéro d'immatriculation</li>}
                                    {!car?.nbrPlaces && <li>• Nombre de places disponibles</li>}
                                    {!car?.carte_grise_scan && <li>• Scan de la carte grise</li>}
                                    {!car?.assurance_numero && <li>• Numéro d'assurance</li>}
                                    {!car?.assurance_expiration && <li>• Date d'expiration de l'assurance</li>}
                                </ul>
                            </div>
                        )}

                        {!carComplete && (
                            <Link href="/cars/create" className="block">
                                <Button className="w-full bg-[#1D63ED] hover:bg-blue-700 text-white font-semibold">
                                    Compléter mon véhicule
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Bouton d'action */}
                    {documentComplete && carComplete && (
                        <Link href="/rides/create" className="block">
                            <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg">
                                Publier un trajet
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

// VerifyBeforePublish.layout = {
//     breadcrumbs: [
//         {
//             title: 'Accueil',
//             href: '/home',
//         },
//         {
//             title: 'Vérifier informations',
//             href: '/rides/verify-before-publish',
//         },
//     ],
// };
