import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Head } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Car, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    getStoredUser,
    isAuthenticated,
    isProfileComplete,
    updateUserProfile,
} from '@/lib/auth-service';

// Champs requis par le backend pour un profil complet
const REQUIRED_FIELDS = ['firstname', 'lastname', 'sex', 'birthday', 'phonenumber'];

export default function OnboardingPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2>(1);

    // Étape 1 — Infos de base
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sex, setSex] = useState<'Homme' | 'Femme'>('Homme');
    const [birthday, setBirthday] = useState('');

    // Étape 2 — Coordonnées & identité
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [numpiece, setNumpiece] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        const user = getStoredUser();
        if (user) {
            // Pré-remplir avec les données existantes
            if (user.firstname) setFirstName(user.firstname);
            if (user.lastname) setLastName(user.lastname);
            if (user.sex === 'Femme') setSex('Femme');
            if (user.birthday && user.birthday !== '2000-01-01') setBirthday(user.birthday);
            if (user.phonenumber) setPhoneNumber(user.phonenumber);
            if (user.address) setAddress(user.address);
            if (user.numpiece) setNumpiece(user.numpiece);

            // Si le profil est déjà complet d'après les données locales, aller au dashboard
            if (isProfileComplete(user)) {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [navigate]);

    const validateStep1 = (): string | null => {
        if (!firstName.trim()) return 'Veuillez renseigner votre prénom.';
        if (!lastName.trim()) return 'Veuillez renseigner votre nom de famille.';
        if (!birthday) return 'Veuillez renseigner votre date de naissance.';
        // Vérifier l'âge minimum (18 ans)
        const birthDate = new Date(birthday);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) return 'Vous devez avoir au moins 18 ans pour utiliser MoveTogether.';
        return null;
    };

    const validateStep2 = (): string | null => {
        if (!phoneNumber.trim()) return 'Veuillez renseigner votre numéro de téléphone.';
        return null;
    };

    const handleNextStep = () => {
        setError('');
        const err = validateStep1();
        if (err) {
            setError(err);
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const err = validateStep2();
        if (err) {
            setError(err);
            return;
        }

        setLoading(true);

        try {
            const res = await updateUserProfile({
                firstname: firstName.trim(),
                lastname: lastName.trim(),
                sex,
                birthday,
                phonenumber: phoneNumber.trim(),
                address: address.trim() || undefined,
                numpiece: numpiece.trim() || undefined,
            });

            if (res.success) {
                navigate('/dashboard', { replace: true });
            } else {
                setError(res.error || 'Erreur lors de la configuration du compte.');
            }
        } catch {
            // En cas d'erreur réseau, on redirige quand même (les données locales ont été sauvegardées)
            navigate('/dashboard', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'mt-1 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800';

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-50 dark:bg-slate-950">
            <Head title="Compléter mon profil - MoveTogether" />

            {/* Volet latéral gauche */}
            <div className="hidden lg:flex lg:w-1/2 h-screen bg-[#1D63ED] min-h-full w-1/2 text-white p-6 text-center relative flex-col items-center justify-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Car className="w-8 h-8 text-white" />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-end p-10 lg:p-12 text-white text-left">
                    <h1 className="text-2xl font-bold">Complétez votre profil</h1>
                    <p className="text-white/80 text-lg mt-2 max-w-sm">
                        Ces informations nous permettent de sécuriser votre compte et de personnaliser votre
                        expérience sur <span className="text-white font-bold">MoveTogether</span>.
                    </p>
                    <div className="mt-6 space-y-2">
                        {REQUIRED_FIELDS.map((f) => (
                            <div key={f} className="flex items-center gap-2 text-white/70 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                                <span className="capitalize">{f === 'phonenumber' ? 'Téléphone' : f === 'birthday' ? 'Date de naissance' : f}</span>
                            </div>
                        ))}
                    </div>
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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Compléter mon profil</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Quelques informations pour sécuriser votre compte.
                        </p>
                    </div>

                    <div className="hidden lg:block mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Compléter mon profil</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {step === 1 ? 'Étape 1 sur 2 — Informations personnelles' : 'Étape 2 sur 2 — Coordonnées et identité'}
                        </p>
                    </div>

                    {/* Indicateur de progression */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 1 ? 'text-[#1D63ED]' : 'text-emerald-600'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${step === 1 ? 'bg-[#1D63ED]' : 'bg-emerald-500'}`}>
                                {step === 1 ? '1' : '✓'}
                            </div>
                            Identité
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 2 ? 'text-[#1D63ED]' : 'text-slate-400'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${step === 2 ? 'bg-[#1D63ED]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                2
                            </div>
                            Coordonnées
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-5 bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* ===== ÉTAPE 1 : Identité ===== */}
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Prénom et Nom */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                        Prénom <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        required
                                        autoFocus
                                        placeholder="Ex: Koffi"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                        Nom <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        required
                                        placeholder="Ex: Dossou"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Sexe */}
                            <div>
                                <Label className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider block mb-1">
                                    Sexe <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    {(['Homme', 'Femme'] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSex(s)}
                                            className={`h-11 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
                                                sex === s
                                                    ? 'bg-[#1D63ED] border-[#1D63ED] text-white shadow-sm'
                                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date de naissance */}
                            <div>
                                <Label htmlFor="birthday" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Date de naissance <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="birthday"
                                    type="date"
                                    required
                                    value={birthday}
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className={inputClass}
                                />
                                <p className="mt-1 text-[11px] text-slate-400">Vous devez avoir au moins 18 ans.</p>
                            </div>

                            <Button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full mt-2 h-11 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-medium text-base rounded-lg transition-colors shadow-sm cursor-pointer"
                            >
                                Continuer
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    {/* ===== ÉTAPE 2 : Coordonnées & identité ===== */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Numéro de téléphone */}
                            <div>
                                <Label htmlFor="phoneNumber" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Numéro de téléphone <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    required
                                    autoFocus
                                    placeholder="+229 01 02 03 04"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Adresse */}
                            <div>
                                <Label htmlFor="address" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Adresse de résidence
                                </Label>
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="Ex: Cotonou, Littoral, Bénin"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            {/* Numéro de pièce d'identité */}
                            <div>
                                <Label htmlFor="numpiece" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Numéro de pièce d'identité (CIP / CNI)
                                </Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="numpiece"
                                        type="text"
                                        placeholder="Ex: CIP123456789"
                                        value={numpiece}
                                        onChange={(e) => setNumpiece(e.target.value)}
                                        className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800 pr-10"
                                    />
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                </div>
                                <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Ce numéro est chiffré (AES-256) et ne sera jamais partagé.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setStep(1); setError(''); }}
                                    className="flex-1 h-11 font-medium border-slate-300 dark:border-slate-700"
                                >
                                    Retour
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-11 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-medium text-base rounded-lg transition-colors shadow-sm cursor-pointer"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Enregistrement...</span>
                                        </div>
                                    ) : (
                                        'Finaliser mon profil'
                                    )}
                                </Button>
                            </div>
                        </form>
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

OnboardingPage.layout = (page: React.ReactNode) => page;
