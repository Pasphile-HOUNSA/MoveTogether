import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    AtSign,
    BriefcaseBusiness,
    Code2,
    Globe,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AppFooter() {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const currentYear = new Date().getFullYear();

    const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            return;
        }

        setIsSubscribing(true);
        try {
            // TODO: Implémenter l'appel API pour souscrire à la newsletter
            // const response = await fetch('/api/newsletter/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email }),
            // });
            // if (response.ok) {
            //     setEmail('');
            //     // Afficher un message de succès
            // }
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {/* Section principale du Footer */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Colonne 1 : Logo & Résumé de la plateforme */}
                    <div className="space-y-4 lg:col-span-4">
                        <Link href="/" className="inline-block">
                            <AppLogo />
                        </Link>
                        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                            La solution de covoiturage moderne, sécurisée et écoresponsable pour vos déplacements au quotidien et inter-villes.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-[#1D63ED] hover:bg-[#1D63ED] hover:text-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#1D63ED] dark:hover:bg-[#1D63ED] dark:hover:text-white"
                            >
                                <Globe className="h-4 w-4" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-[#1D63ED] hover:bg-[#1D63ED] hover:text-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#1D63ED] dark:hover:bg-[#1D63ED] dark:hover:text-white"
                            >
                                <BriefcaseBusiness className="h-4 w-4" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-[#1D63ED] hover:bg-[#1D63ED] hover:text-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#1D63ED] dark:hover:bg-[#1D63ED] dark:hover:text-white"
                            >
                                <Code2 className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-[#1D63ED] hover:bg-[#1D63ED] hover:text-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#1D63ED] dark:hover:bg-[#1D63ED] dark:hover:text-white"
                            >
                                <AtSign className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Liens utiles */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
                        {/* Navigation Plateforme */}
                        <div>
                            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-white">
                                Plateforme
                            </h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                <li>
                                    <Link
                                        href="/rides/search"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Rechercher un trajet
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/rides/verify-before-publish"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Proposer un trajet
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/#comment-ca-marche"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Comment ça marche
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/#avantages"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Économies & avantages
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Liens Entreprise & Sécurité */}
                        <div>
                            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-white">
                                À propos
                            </h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                <li>
                                    <Link
                                        href="/#comment-ca-marche"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Notre histoire
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/#avantages"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Charte de sécurité
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/#avis"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Avis membres
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Contact & Support
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Légales */}
                        <div>
                            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-white">
                                Légal
                            </h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                <li>
                                    <Link
                                        href="/cgu"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Conditions Générales
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/confidentialite"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Confidentialité
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cookies"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Gestion des cookies
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/mentions-legales"
                                        className="transition-colors hover:text-[#1D63ED]"
                                    >
                                        Mentions légales
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Colonne 3 : Newsletter */}
                    <div className="space-y-4 lg:col-span-3">
                        <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-white">
                            Restez informé
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Abonnez-vous à notre newsletter pour recevoir les offres et conseils de covoiturage.
                        </p>
                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="flex flex-col gap-2"
                        >
                            <Input
                                type="email"
                                placeholder="Votre adresse e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubscribing}
                                className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm focus-visible:ring-[#1D63ED] dark:border-slate-800 dark:bg-slate-800"
                            />
                            <Button
                                type="submit"
                                disabled={isSubscribing}
                                className="h-10 rounded-xl bg-[#1D63ED] font-medium text-white transition-colors hover:bg-[#1552C6] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubscribing ? 'Abonnement...' : 'S\'abonner'}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Bas du footer / Copyright */}
                <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-200 pt-8 sm:flex-row dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        &copy; {currentYear} MoveTogether. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
