import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AlertCircle, ArrowRight, Car, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendMagicLink } from '@/lib/auth-service';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sex, setSex] = useState<'Homme' | 'Femme'>('Homme');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [notifications, setNotifications] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [devLink, setDevLink] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setDevLink(null);

        if (!firstName.trim()) {
            setError('Veuillez renseigner votre prénom.');
            return;
        }

        if (!lastName.trim()) {
            setError('Veuillez renseigner votre nom.');
            return;
        }

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes('@')) {
            setError('Veuillez renseigner une adresse email valide.');
            return;
        }

        if (!phoneNumber.trim()) {
            setError('Veuillez renseigner votre numéro de téléphone.');
            return;
        }

        setLoading(true);

        try {
            const result = await sendMagicLink(cleanEmail, {
                firstname: firstName.trim(),
                lastname: lastName.trim(),
                sex,
                phonenumber: phoneNumber.trim(),
            });

            if (result.success) {
                setSuccess(true);
                if (result.devLink) {
                    setDevLink(result.devLink);
                }
            } else {
                setError(result.error || "Impossible d'initier la création de compte.");
            }
        } catch {
            setError('Une erreur est survenue lors de la communication avec le serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-50 dark:bg-slate-950">
            <Head title="Nouveau Compte - MoveTogether" />

            {/* Volet latéral gauche - Design original MoveTogether */}
            <div className="hidden lg:flex lg:w-1/2 h-screen bg-[#1D63ED] min-h-full w-1/2 text-white p-6 text-center relative flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Car className="w-7 h-7 text-white" />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-end p-10 lg:p-12 text-white text-left">
                    <h1 className="text-2xl font-bold">Nouveau Compte</h1>
                    <p className="text-white/80 text-xl mt-1">
                        Rejoignez <span className="text-white font-bold">MoveTogether</span>, la communauté qui partage la route.
                    </p>
                </div>
            </div>

            {/* Formulaire à droite */}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center py-7 sm:px-6 lg:px-8 overflow-y-auto">
                <div className="w-full max-w-md px-4 sm:px-0">
                    {/* Header mobile */}
                    <div className="mb-6 lg:hidden text-center">
                        <div className="w-12 h-12 bg-[#1D63ED] rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                            <Car className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nouveau Compte</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Renseignez vos informations ci-dessous pour créer votre profil.
                        </p>
                    </div>

                    <div className="hidden lg:block mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nouveau Compte</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Renseignez vos informations ci-dessous pour créer votre profil.
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-5 bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* PRÉNOM */}
                            <div>
                                <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Prénom
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="Ex: Koffi"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="mt-1 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                            </div>

                            {/* NOM */}
                            <div>
                                <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Nom
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    required
                                    placeholder="Ex: Dossou"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                            </div>

                            {/* SEXE */}
                            <div>
                                <Label className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider block mb-1">
                                    Sexe
                                </Label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setSex('Homme')}
                                        className={`h-11 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
                                            sex === 'Homme'
                                                ? 'bg-[#1D63ED] border-[#1D63ED] text-white shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        Homme
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSex('Femme')}
                                        className={`h-11 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
                                            sex === 'Femme'
                                                ? 'bg-[#1D63ED] border-[#1D63ED] text-white shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        Femme
                                    </button>
                                </div>
                            </div>

                            {/* ADRESSE EMAIL PROFESSIONNELLE */}
                            <div>
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Adresse email professionnelle
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="monemail@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                            </div>

                            {/* NUMÉRO DE TÉLÉPHONE */}
                            <div>
                                <Label htmlFor="phoneNumber" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Numéro de téléphone
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    required
                                    placeholder="+2290102030"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                            </div>

                            {/* Case à cocher notifications */}
                            <div className="flex items-start space-x-2 pt-1">
                                <Checkbox
                                    id="notifications"
                                    checked={notifications}
                                    onCheckedChange={(checked) => setNotifications(Boolean(checked))}
                                    className="mt-0.5 data-[state=checked]:bg-[#1D63ED] data-[state=checked]:border-[#1D63ED] data-[state=checked]:text-white"
                                />
                                <Label htmlFor="notifications" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none leading-normal">
                                    Activer les notifications push pour les alertes et demandes de trajet
                                </Label>
                            </div>

                            {/* Bouton Créer mon compte et continuer */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 h-11 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-medium text-base rounded-lg transition-colors shadow-sm cursor-pointer"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Génération du lien...</span>
                                    </div>
                                ) : (
                                    'Créer mon compte et continuer'
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-1 mt-6 text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Vous avez déjà un compte ?</span>
                                <Link href="/login" className="text-[#1D63ED] font-semibold hover:underline">
                                    Se connecter
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#28A745] flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                    Lien d'activation envoyé
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Un lien de confirmation a été transmis à <strong>{email}</strong>. Cliquez dessus pour valider l'ouverture de votre compte.
                                </p>
                            </div>

                            {devLink && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2 text-left">
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Environnement local :
                                    </p>
                                    <a
                                        href={devLink}
                                        className="inline-flex items-center justify-center w-full py-2 px-3 bg-[#1D63ED] text-white rounded-lg text-xs font-medium hover:bg-[#1552C6] transition-colors"
                                    >
                                        Valider mon inscription
                                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                    </a>
                                </div>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSuccess(false);
                                    setDevLink(null);
                                }}
                                className="text-xs h-9"
                            >
                                Modifier mes informations
                            </Button>
                        </div>
                    )}

                    <div className="text-center text-xs text-slate-400 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                        En vous connectant vous acceptez nos{' '}
                        <span className="underline cursor-pointer">conditions générales d'utilisation</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

Register.layout = (page: React.ReactNode) => page;
