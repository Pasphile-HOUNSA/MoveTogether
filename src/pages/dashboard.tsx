import { Head, Link } from '@inertiajs/react';
import {
    Car,
    Search,
    PlusCircle,
    Calendar,
    MapPin,
    Users,
    ArrowRight,
    Clock,
    DollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Types & Interfaces ---
export interface Ride {
    id: number;
    departure: string;
    destination: string;
    departureTime: string;
    availableSeats: number;
    price: number;
    currency?: string;
}

export interface Props {
    auth?: {
        user?: {
            firstName?: string;
            lastName?: string;
            name?: string;
        };
    };
    stats?: {
        activeRides?: number;
        completedRides?: number;
        totalPassengers?: number;
        totalEarnings?: number;
    };
    upcomingRides?: Ride[];
}

// --- Petits composants internes ---

function greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
}

function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    tint: string; // classes bg + text pour le badge d'icône
}

function StatCard({ label, value, icon: Icon, tint }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                    {label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</h3>
            </div>
            <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${tint}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
}

// --- Main Dashboard Component ---
export default function Dashboard({ auth, stats, upcomingRides = [] }: Props) {
    const displayName =
        [auth?.user?.firstName, auth?.user?.lastName].filter(Boolean).join(' ') ||
        auth?.user?.name ||
        'Conducteur';
    const firstName = auth?.user?.firstName || auth?.user?.name?.split(' ')[0] || 'Conducteur';

    return (
        <>
            <Head title="Tableau de bord" />

            <div className="w-full relative flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 bg-[#EEF2F8] dark:bg-slate-950 min-h-screen">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                    {/* 1. Bandeau de bienvenue */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#1D63ED] to-[#245FDB] rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-900/10">
                        {/* Motif décoratif discret */}
                        <svg
                            className="absolute -right-6 -top-10 w-56 h-56 text-white/10 pointer-events-none"
                            viewBox="0 0 200 200"
                            fill="none"
                        >
                            <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="1.5" />
                        </svg>

                        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 shrink-0 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-sm font-bold">
                                    {initials(displayName)}
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                                        {greeting()}, {firstName} !
                                    </h1>
                                    <p className="text-blue-100/90 text-sm mt-1 max-w-md">
                                        Prêt pour votre prochain trajet ? Recherchez ou proposez une course dès maintenant.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 w-full md:w-auto">
                                <Link href="/rides/search" className="flex-1 md:flex-none">
                                    <Button className="w-full bg-white text-[#1D63ED] hover:bg-blue-50 font-semibold shadow-sm">
                                        <Search className="w-4 h-4 mr-2" />
                                        Rechercher
                                    </Button>
                                </Link>
                                <Link href="/rides/verify-before-publish" className="flex-1 md:flex-none">
                                    <Button className="w-full bg-[#123f9c] hover:bg-[#0f3583] text-white font-semibold border border-white/10">
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Publier
                                    </Button>
                                </Link>
                                <Link href="/cars/create" className="hidden md:block">
                                    <Button
                                        variant="outline"
                                        className="text-white border-white/40 hover:bg-white/10 hover:text-white font-semibold bg-transparent"
                                    >
                                        <Car className="w-4 h-4 mr-2" />
                                        Mes véhicules
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 2. Cartes de statistiques */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Trajets en cours"
                            value={stats?.activeRides ?? 0}
                            icon={Car}
                            tint="bg-blue-50 text-[#1D63ED] dark:bg-blue-950/40"
                        />
                        <StatCard
                            label="Trajets effectués"
                            value={stats?.completedRides ?? 0}
                            icon={Calendar}
                            tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                        />
                        <StatCard
                            label="Passagers transportés"
                            value={stats?.totalPassengers ?? 0}
                            icon={Users}
                            tint="bg-purple-50 text-purple-600 dark:bg-purple-950/40"
                        />
                        <StatCard
                            label="Gains cumulés"
                            value={`${(stats?.totalEarnings ?? 0).toLocaleString()} FCFA`}
                            icon={DollarSign}
                            tint="bg-amber-50 text-amber-600 dark:bg-amber-950/40"
                        />
                    </div>

                    {/* 3. Prochains trajets */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex-1">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                Vos prochains trajets
                            </h2>
                            <Link
                                href="/rides"
                                className="text-xs font-semibold text-[#1D63ED] hover:underline flex items-center gap-1"
                            >
                                Voir tout <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {upcomingRides.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingRides.map((ride) => (
                                    <div
                                        key={ride.id}
                                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#1D63ED]/40 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 shrink-0 bg-blue-50 text-[#1D63ED] dark:bg-blue-950/40 rounded-xl flex items-center justify-center">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                    {ride.departure} → {ride.destination}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {ride.departureTime}
                                                    </span>
                                                    <span aria-hidden>•</span>
                                                    <span>
                                                        {ride.availableSeats} place{ride.availableSeats > 1 ? 's' : ''}{' '}
                                                        disponible{ride.availableSeats > 1 ? 's' : ''}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                                            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1 rounded-full whitespace-nowrap">
                                                {ride.price.toLocaleString()} {ride.currency || 'FCFA'}
                                            </span>
                                            <Link href={`/rides/${ride.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                                                >
                                                    Détails
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-14 flex flex-col items-center justify-center text-center bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3">
                                    <Clock className="w-6 h-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Aucun trajet prévu
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                    Vous n'avez pas encore de trajet à venir. Proposez une course ou recherchez-en une
                                    dès maintenant.
                                </p>
                                <div className="mt-4">
                                    <Link href="/rides/verify-before-publish">
                                        <Button size="sm" className="bg-[#1D63ED] hover:bg-[#1552C6] text-white">
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Publier un trajet
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};