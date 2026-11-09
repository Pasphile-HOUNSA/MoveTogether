import { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Car, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isProfileComplete, verifyMagicLink } from '@/lib/auth-service';

type VerificationState = 'loading' | 'success' | 'error';

export default function VerifyMagicLinkPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [state, setState] = useState<VerificationState>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [redirectTarget, setRedirectTarget] = useState<'/dashboard' | '/onboarding'>('/dashboard');
    const hasAttempted = useRef<boolean>(false);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setState('error');
            setErrorMessage('Le lien utilisé est incomplet ou le jeton de sécurité est manquant.');
            return;
        }

        // Évite le double déclenchement en mode développement (React StrictMode)
        if (hasAttempted.current) {
            return;
        }
        hasAttempted.current = true;

        verifyMagicLink(token)
            .then((result) => {
                if (result.success) {
                    setState('success');
                    const complete = isProfileComplete(result.user || null);
                    const target = complete ? '/dashboard' : '/onboarding';
                    setRedirectTarget(target);

                    setTimeout(() => {
                        navigate(target, { replace: true });
                    }, 1200);
                } else {
                    setState('error');
                    setErrorMessage(result.error || 'Le lien de connexion a expiré ou a déjà été utilisé.');
                }
            })
            .catch(() => {
                setState('error');
                setErrorMessage('Une erreur réseau est survenue lors de la validation.');
            });
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-50 dark:bg-slate-950">
            <Head title="Vérification - MoveTogether" />

            {/* Volet latéral gauche - Design original MoveTogether */}
            <div className="hidden lg:flex lg:w-1/2 h-screen bg-[#1D63ED] min-h-full w-1/2 text-white p-6 text-center relative flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Car className="w-7 h-7 text-white" />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-end p-10 lg:p-12 text-white text-left">
                    <h1 className="text-2xl font-bold">Vérification sécurisée</h1>
                    <p className="text-white/80 text-xl mt-1">
                        Rejoignez <span className="text-white font-bold">MoveTogether</span>, la communauté qui partage la route.
                    </p>
                </div>
            </div>

            {/* Corps à droite */}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center py-7 sm:px-6 lg:px-8 overflow-y-auto">
                <div className="w-full max-w-md px-4 sm:px-0">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                        {state === 'loading' && (
                            <div className="py-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#1D63ED] flex items-center justify-center mx-auto">
                                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Vérification du lien
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Validation de votre accès en cours...
                                    </p>
                                </div>
                            </div>
                        )}

                        {state === 'success' && (
                            <div className="py-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#28A745] flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Connexion confirmée
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        {redirectTarget === '/onboarding'
                                            ? 'Finalisation de votre profil...'
                                            : 'Ouverture de votre espace...'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {state === 'error' && (
                            <div className="py-4 space-y-5">
                                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Lien invalide ou expiré
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        {errorMessage}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-[#1D63ED] hover:bg-[#1552C6] text-white font-medium"
                                >
                                    <span>Demander un nouveau lien</span>
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="text-center text-xs text-slate-400 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                        Plateforme sécurisée de covoiturage MoveTogether
                    </div>
                </div>
            </div>
        </div>
    );
}

VerifyMagicLinkPage.layout = (page: React.ReactNode) => page;
