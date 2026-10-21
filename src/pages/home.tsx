import { Head, Link } from '@inertiajs/react';
import {
    Search,
    PlusCircle,
    ShieldCheck,
    Clock,
    Coins,
    MapPin,
    Calendar,
    ArrowRight,
    Star,
    CheckCircle2,
    Users,
    Route,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/app-footer';

// --- Petits composants internes réutilisables ---

interface StatProps {
    icon: LucideIcon;
    value: string;
    label: string;
}

function Stat({ icon: Icon, value, label }: StatProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#1D63ED] flex items-center justify-center">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    );
}

interface StepProps {
    number: number;
    title: string;
    description: string;
    tint: string;
}

function Step({ number, title, description, tint }: StepProps) {
    return (
        <div className="relative bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold ${tint}`}>
                {number}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

interface BenefitProps {
    icon: LucideIcon;
    title: string;
    description: string;
    tint: string;
}

function Benefit({ icon: Icon, title, description, tint }: BenefitProps) {
    return (
        <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{description}</p>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <>
            <Head title="MoveTogether - Covoiturage & Trajets Partagés" />

            <main className="bg-[#EEF2F8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
                {/* 2. Hero Section + Barre de recherche */}
                <section className="w-full relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-[#EEF2F8] to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-16 pb-20">
                    {/* Motif décoratif — écho au bandeau du dashboard */}
                    <svg
                        className="absolute -right-16 -top-16 w-80 h-80 text-[#1D63ED]/5 dark:text-blue-400/5 pointer-events-none"
                        viewBox="0 0 200 200"
                        fill="none"
                    >
                        <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1.5" />
                    </svg>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">

                        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                            Voyagez partout, <span className="text-[#1D63ED]">à moindre coût</span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Rejoignez des milliers de conducteurs et passagers. Économisez sur vos trajets quotidiens et
                            interurbains en toute sécurité.
                        </p>

                        {/* Barre de Recherche Rapide */}
                        <div className="mt-8 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-[#1D63ED]" /> Départ
                                </label>
                                <Input placeholder="Ville de départ" className="border-slate-200 dark:border-slate-800" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Destination
                                </label>
                                <Input placeholder="Ville d'arrivée" className="border-slate-200 dark:border-slate-800" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-purple-500" /> Date
                                </label>
                                <Input type="date" className="border-slate-200 dark:border-slate-800" />
                            </div>

                            <div className="flex items-end">
                                <Link href="/rides/search" className="w-full">
                                    <Button className="w-full h-10 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold rounded-xl gap-2">
                                        <Search className="w-4 h-4" /> Rechercher
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Section Statistiques */}
                <section id="avis" className="w-full border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-10">
                    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x md:divide-slate-100 dark:md:divide-slate-800">
                        <Stat icon={Users} value="50K+" label="Utilisateurs actifs" />
                        <Stat icon={Route} value="120K+" label="Trajets réalisés" />
                        <Stat icon={Star} value="4.8/5" label="Note moyenne" />
                        <Stat icon={ShieldCheck} value="100%" label="Profils vérifiés" />
                    </div>
                </section>

                {/* 4. Comment ça marche */}
                <section id="comment-ca-marche" className="w-full py-20 bg-white dark:bg-slate-950">
                    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Comment ça marche ?</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                                En seulement 3 étapes simples, commencez à covoiturer facilement.
                            </p>
                        </div>

                        <div className="relative grid md:grid-cols-3 gap-8">
                            {/* Connecteur en pointillés entre les étapes, visible uniquement en desktop */}
                            <div
                                className="hidden md:block absolute top-14 left-[16.5%] right-[16.5%] border-t-2 border-dashed border-[#1D63ED]/20 dark:border-blue-400/20"
                                aria-hidden
                            />

                            <Step
                                number={1}
                                title="Recherchez ou Publiez"
                                description="Entrez votre itinéraire en tant que passager ou proposez vos places disponibles si vous êtes conducteur."
                                tint="bg-blue-50 dark:bg-blue-950/50 text-[#1D63ED]"
                            />
                            <Step
                                number={2}
                                title="Réservez en ligne"
                                description="Sélectionnez le trajet qui vous convient et réservez votre siège en toute sécurité."
                                tint="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600"
                            />
                            <Step
                                number={3}
                                title="Voyagez sereinement"
                                description="Retrouvez votre conducteur au point de RDV et profitez d'un trajet agréable et économique."
                                tint="bg-purple-50 dark:bg-purple-950/50 text-purple-600"
                            />
                        </div>
                    </div>
                </section>

                {/* 5. Avantages */}
                <section id="avantages" className="w-full bg-slate-100/70 dark:bg-slate-900/40 py-20">
                    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                Pourquoi choisir MoveTogether pour vos déplacements ?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                Une plateforme pensée pour votre confort, votre portefeuille et votre sécurité au quotidien.
                            </p>

                            <div className="space-y-4 pt-2">
                                <Benefit
                                    icon={Coins}
                                    title="Économies garanties"
                                    description="Partagez les frais de carburant et de péage sans surprise."
                                    tint="bg-blue-100 dark:bg-blue-900/50 text-[#1D63ED]"
                                />
                                <Benefit
                                    icon={ShieldCheck}
                                    title="Sécurité & Confiance"
                                    description="Profils vérifiés, avis authentiques et pièces d'identité contrôlées."
                                    tint="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600"
                                />
                                <Benefit
                                    icon={Clock}
                                    title="Flexibilité totale"
                                    description="Des départs réguliers chaque jour sur de nombreuses destinations."
                                    tint="bg-purple-100 dark:bg-purple-900/50 text-purple-600"
                                />
                            </div>
                        </div>

                        {/* Banner d'incitation conducteur */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#1D63ED] to-[#245FDB] text-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-blue-900/10 space-y-6">
                            <svg
                                className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 pointer-events-none"
                                viewBox="0 0 200 200"
                                fill="none"
                            >
                                <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="1.5" />
                            </svg>

                            <div className="relative space-y-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                    <PlusCircle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Vous conduisez régulièrement ?</h3>
                                <p className="text-blue-100/90 text-sm leading-relaxed">
                                    Ne voyagez plus à vide ! Rentabilisez vos déplacements quotidiens ou vos trajets de
                                    week-end en publiant vos places libres sur MoveTogether.
                                </p>
                                <ul className="space-y-2 text-sm text-blue-50">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Publication gratuite et
                                        rapide
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Vous choisissez vos
                                        passagers
                                    </li>
                                </ul>
                                <Link href="/rides/verify-before-publish" className="block pt-2">
                                    <Button className="w-full bg-white text-[#1D63ED] hover:bg-blue-50 font-semibold rounded-xl h-11">
                                        Proposer un trajet <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 6. Footer */}
            <Footer />
        </>
    );
}

Home.layout = {
    breadcrumbs: [
        {
            title: 'Accueil',
            href: '/home',
        },
    ],
};