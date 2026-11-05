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

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [devLink, setDevLink] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setDevLink(null);

        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes('@')) {
            setError('Veuillez renseigner une adresse email valide.');
            return;
        }

        setLoading(true);

        try {
            const result = await sendMagicLink(cleanEmail);

            if (result.success) {
                setSuccess(true);
                if (result.devLink) {
                    setDevLink(result.devLink);
                }
            } else {
                setError(result.error || "Impossible d'envoyer le lien de connexion.");
            }
        } catch {
            setError('Une erreur est survenue lors de la communication avec le serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-50 dark:bg-slate-950">
            <Head title="Connexion - MoveTogether" />

            {/* Volet latéral gauche - Design original MoveTogether */}
            <div className="hidden lg:flex lg:w-1/2 h-screen bg-[#1D63ED] min-h-full w-1/2 text-white p-6 text-center relative flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Car className="w-7 h-7 text-white" />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-end p-10 lg:p-12 text-white text-left">
                    <h1 className="text-2xl font-bold">Connexion</h1>
                    <p className="text-white/80 text-xl mt-1">
                        Accédez à votre compte <span className="text-white font-bold">MoveTogether</span> pour continuer
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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Connexion</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Accédez à votre compte <span className="text-[#1D63ED] font-bold">MoveTogether</span> pour continuer
                        </p>
                    </div>

                    <div className="hidden lg:block mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Accès Espace Membre</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Saisissez votre email pour accéder à votre espace.
                        </p>
                    </div>

                    {status && (
                        <Alert className="mb-5 border-[#28A745] bg-emerald-50 text-[#1e7e34] dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                            <CheckCircle className="h-4 w-4 text-[#28A745]" />
                            <AlertDescription>{status}</AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-5 bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider">
                                    Adresse email professionnelle
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="monemail@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    className="mt-1 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="notifications"
                                    checked={notifications}
                                    onCheckedChange={(checked) => setNotifications(Boolean(checked))}
                                    className="data-[state=checked]:bg-[#1D63ED] data-[state=checked]:border-[#1D63ED] data-[state=checked]:text-white"
                                />
                                <Label htmlFor="notifications" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                                    Autoriser les notifications instantanées (Recommandé)
                                </Label>
                            </div>

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
                                        <span>Envoi en cours...</span>
                                    </div>
                                ) : (
                                    'Continuer'
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-1 mt-6 text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Vous n'avez pas de compte ?</span>
                                <Link href="/register" className="text-[#1D63ED] font-semibold hover:underline">
                                    Créer un compte
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
                                    Lien de connexion envoyé
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Un email d'accès a été envoyé à <strong>{email}</strong>. Cliquez sur le lien pour vous connecter.
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
                                        Valider la connexion
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
                                Utiliser une autre adresse
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

Login.layout = (page: React.ReactNode) => page;
