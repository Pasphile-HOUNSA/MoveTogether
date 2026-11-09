import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {
    isAuthenticated,
    getStoredUser,
    fetchCurrentUser,
    isProfileComplete,
    type AuthUser,
} from '@/lib/auth-service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Composant de protection des routes MoveTogether.
 * Vérifie d'abord :
 * 1. Que l'utilisateur est bien connecté.
 * 2. Que toutes les informations de la table 'users' sont complètes.
 * Si une information manque, l'utilisateur est systématiquement redirigé vers /onboarding.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
    const [hasToken, setHasToken] = useState(() => isAuthenticated());

    useEffect(() => {
        if (!isAuthenticated()) {
            setHasToken(false);
            setLoading(false);
            return;
        }

        setHasToken(true);

        // Synchroniser avec l'API backend pour vérifier l'exhaustivité réelle en base de données
        fetchCurrentUser()
            .then((res) => {
                if (res.success && res.user) {
                    setUser(res.user);
                }
            })
            .catch(() => {
                // En cas d'erreur réseau, s'appuyer sur le cache local
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location.pathname]);

    // 1. Utilisateur non connecté
    if (!hasToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Vérification en cours
    if (loading && !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#1D63ED]" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Vérification de votre compte...
                </p>
            </div>
        );
    }

    // 3. Contrôle strict de complétion de la table users
    const complete = isProfileComplete(user);

    if (!complete) {
        // Redirection forcée vers l'onboarding avec le chemin d'origine en mémoire
        return (
            <Navigate
                to="/onboarding"
                state={{
                    from: location,
                    reason: 'profile_incomplete',
                    missingFields: user?.missingFields,
                }}
                replace
            />
        );
    }

    // 4. Profil complet : autoriser l'accès à la page demandée
    return <>{children}</>;
}
