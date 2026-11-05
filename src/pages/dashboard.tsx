import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Head, Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Car,
    Search,
    PlusCircle,
    Calendar,
    Users,
    Coins,
    Wallet,
    MessageSquare,
    ShieldCheck,
    User,
    LogOut,
    Bell,
    CheckCircle2,
    Menu,
    X,
    ExternalLink,
    TrendingUp,
    History,
    ChevronRight,
    Phone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    getStoredUser,
    isAuthenticated,
    isProfileComplete,
    clearAuth,
    type AuthUser,
} from '@/lib/auth-service';

// --- Interfaces & Types ---
export interface DashboardRide {
    id: number;
    depart: string;
    arrivee: string;
    date: string;
    heure: string;
    placesDisponibles: number;
    placesOccupees: number;
    prix: number;
    role: 'conducteur' | 'passager';
    statut: 'confirme' | 'en_attente' | 'termine';
    vehicule?: string;
    passagers?: string[];
}

export interface ActivityItem {
    id: number;
    type: 'reservation' | 'gain' | 'trajet';
    titre: string;
    description: string;
    date: string;
    montant?: number;
}

// --- Données de démonstration professionnelles ---
const DEFAULT_RIDES: DashboardRide[] = [
    {
        id: 1,
        depart: 'Cotonou (Étoile Rouge)',
        arrivee: 'Abomey-Calavi (IITA / UAC)',
        date: "Aujourd'hui",
        heure: '17:30',
        placesDisponibles: 1,
        placesOccupees: 3,
        prix: 1000,
        role: 'conducteur',
        statut: 'confirme',
        vehicule: 'Toyota Corolla - Climatisation',
        passagers: ['Marius A.', 'Koffi D.', 'Grace B.'],
    },
    {
        id: 2,
        depart: 'Porto-Novo (Carrefour Cinquantenaire)',
        arrivee: 'Cotonou (Ganhi / Marina)',
        date: 'Demain',
        heure: '06:45',
        placesDisponibles: 2,
        placesOccupees: 2,
        prix: 1500,
        role: 'conducteur',
        statut: 'en_attente',
        vehicule: 'Toyota Corolla - Climatisation',
        passagers: ['Marc T.', 'Amina K.'],
    },
    {
        id: 3,
        depart: 'Cotonou (Cadjehoun)',
        arrivee: 'Ouidah (Place Chacha)',
        date: 'Samedi 08 Nov.',
        heure: '14:00',
        placesDisponibles: 0,
        placesOccupees: 1,
        prix: 2000,
        role: 'passager',
        statut: 'confirme',
        vehicule: 'Kia Sportage - Conducteur : Christian D.',
    },
];

const RECENT_ACTIVITIES: ActivityItem[] = [
    {
        id: 1,
        type: 'reservation',
        titre: 'Réservation confirmée',
        description: 'Marius A. a réservé 1 place pour Cotonou ➔ Calavi',
        date: 'Il y a 25 min',
        montant: 1000,
    },
    {
        id: 2,
        type: 'gain',
        titre: 'Crédit reçu sur portefeuille',
        description: 'Course Cotonou ➔ Porto-Novo terminée avec succès',
        date: 'Hier à 19:10',
        montant: 4500,
    },
    {
        id: 3,
        type: 'trajet',
        titre: 'Trajet publié',
        description: 'Nouveau trajet vers Calavi ajouté au planning',
        date: 'Hier à 14:00',
    },
];

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

interface StatKpiProps {
    label: string;
    value: string;
    subtext: string;
    icon: LucideIcon;
    trend?: string;
    tint: string;
}

function StatKpi({ label, value, subtext, icon: Icon, trend, tint }: StatKpiProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {label}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tint}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{value}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {trend && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            {trend}
                        </span>
                    )}
                    <span>{subtext}</span>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [rideFilter, setRideFilter] = useState<'tous' | 'conducteur' | 'passager'>('tous');
    const [rides] = useState<DashboardRide[]>(DEFAULT_RIDES);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
            if (isAuthenticated() && !isProfileComplete(storedUser)) {
                navigate('/onboarding', { replace: true });
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        clearAuth();
        navigate('/login', { replace: true });
    };

    const displayName =
        [user?.firstname, user?.lastname].filter(Boolean).join(' ') ||
        user?.name ||
        user?.email ||
        'Membre MoveTogether';

    const firstName = user?.firstname || displayName.split(' ')[0] || 'Membre';
    const userRole = user?.role || 'Conducteur vérifié';

    const filteredRides = rides.filter((r) => {
        if (rideFilter === 'tous') return true;
        return r.role === rideFilter;
    });

    return (
        <>
            <Head title="Tableau de bord - MoveTogether" />

            <div className="min-h-screen bg-[#EEF2F8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans">
                {/* 1. SIDEBAR DESKTOP & MOBILE */}

                {/* Backdrop pour mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${sidebarCollapsed ? 'lg:w-20' : 'w-64 lg:w-72'}`}
                >
                    {/* Header de la Sidebar */}
                    <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200/80 dark:border-slate-800">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1D63ED] text-white shadow-md shadow-blue-500/20">
                                <AppLogoIcon className="h-5 w-5 fill-current text-white" />
                            </div>
                            {!sidebarCollapsed && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                                        Move<span className="text-[#1D63ED]">Together</span>
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                                        Espace Gestion
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Bouton de fermeture mobile */}
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Principale de la Sidebar */}
                    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
                        {/* Section Menu Principal */}
                        <div>
                            {!sidebarCollapsed && (
                                <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Menu Principal
                                </p>
                            )}
                            <nav className="space-y-1">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm bg-[#1D63ED] text-white shadow-sm shadow-blue-500/20"
                                >
                                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                                    {!sidebarCollapsed && <span>Tableau de bord</span>}
                                </Link>

                                <Link
                                    href="/rides/search"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <Search className="w-5 h-5 shrink-0 text-slate-400" />
                                    {!sidebarCollapsed && <span>Rechercher un trajet</span>}
                                </Link>

                                <Link
                                    href="/rides/verify-before-publish"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <PlusCircle className="w-5 h-5 shrink-0 text-[#1D63ED]" />
                                        {!sidebarCollapsed && <span>Publier un trajet</span>}
                                    </div>
                                    {!sidebarCollapsed && (
                                        <span className="bg-blue-50 dark:bg-blue-950 text-[#1D63ED] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            Nouveau
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    href="/cars/create"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <Car className="w-5 h-5 shrink-0 text-slate-400" />
                                    {!sidebarCollapsed && <span>Mes véhicules</span>}
                                </Link>
                            </nav>
                        </div>

                        {/* Section Activité & Services */}
                        <div>
                            {!sidebarCollapsed && (
                                <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Services & Gains
                                </p>
                            )}
                            <nav className="space-y-1">
                                <a
                                    href="#portefeuille"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Wallet className="w-5 h-5 shrink-0 text-emerald-600" />
                                        {!sidebarCollapsed && <span>Portefeuille</span>}
                                    </div>
                                    {!sidebarCollapsed && (
                                        <span className="text-xs font-bold text-emerald-600">
                                            45 000 F
                                        </span>
                                    )}
                                </a>

                                <a
                                    href="#activite"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <History className="w-5 h-5 shrink-0 text-slate-400" />
                                    {!sidebarCollapsed && <span>Historique des courses</span>}
                                </a>
                            </nav>
                        </div>

                        {/* Section Paramètres & Sécurité */}
                        <div>
                            {!sidebarCollapsed && (
                                <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Compte & Sécurité
                                </p>
                            )}
                            <nav className="space-y-1">
                                <Link
                                    href="/settings/profile"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <User className="w-5 h-5 shrink-0 text-slate-400" />
                                    {!sidebarCollapsed && <span>Mon profil</span>}
                                </Link>

                                <Link
                                    href="/settings/security"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <ShieldCheck className="w-5 h-5 shrink-0 text-slate-400" />
                                    {!sidebarCollapsed && <span>Sécurité & Sessions</span>}
                                </Link>

                                <Link
                                    href="/"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5 shrink-0 text-slate-400" />
                                    {!sidebarCollapsed && <span>Retour au site public</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Footer de la Sidebar : Profil utilisateur & Déconnexion */}
                    <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#1D63ED] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    {getInitials(displayName)}
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {displayName}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {user?.email || 'compte@movetogether.bj'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Se déconnecter"
                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* 2. ZONE PRINCIPALE DU DASHBOARD */}
                <div
                    className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                    }`}
                >
                    {/* Header Supérieur du Dashboard */}
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/90">
                        {/* Gauche : Toggle Sidebar & Fil d'ariane */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                                aria-label="Ouvrir le menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Réduire la barre latérale"
                            >
                                <Menu className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                <Link href="/" className="hover:text-[#1D63ED]">Accueil</Link>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                                <span className="font-bold text-slate-900 dark:text-white">Tableau de bord</span>
                            </div>
                        </div>

                        {/* Droite : Notifications & Action rapide */}
                        <div className="flex items-center gap-3">
                            <Link href="/rides/verify-before-publish">
                                <Button className="h-9 px-4 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold text-xs rounded-xl shadow-sm gap-2">
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">Proposer un trajet</span>
                                </Button>
                            </Link>

                            <div className="relative">
                                <button
                                    type="button"
                                    className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                                </button>
                            </div>

                            <Link href="/settings/profile">
                                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#1D63ED] flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700 hover:border-[#1D63ED] transition-colors">
                                    {getInitials(displayName)}
                                </div>
                            </Link>
                        </div>
                    </header>

                    {/* Corps de Page du Dashboard */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
                        {/* 1. BANDEAU DE BIENVENUE PREMIUM */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#1D63ED] via-[#1A56CC] to-[#0D3B99] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
                            {/* Cercles décoratifs */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                            <div className="absolute bottom-0 right-1/3 -mb-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4 sm:gap-5">
                                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xl shadow-inner">
                                        {getInitials(displayName)}
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2 border border-white/20">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            {userRole}
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                                            {getGreeting()}, {firstName}
                                        </h1>
                                        <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-lg">
                                            Bienvenue sur votre espace de gestion. Vos prochains départs et vos gains sont synchronisés en temps réel.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                                    <Link href="/rides/search" className="flex-1 sm:flex-none">
                                        <Button className="w-full h-11 bg-white hover:bg-blue-50 text-[#1D63ED] font-bold text-xs rounded-xl shadow-sm gap-2">
                                            <Search className="w-4 h-4" />
                                            Rechercher une place
                                        </Button>
                                    </Link>
                                    <Link href="/rides/verify-before-publish" className="flex-1 sm:flex-none">
                                        <Button className="w-full h-11 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs rounded-xl gap-2">
                                            <PlusCircle className="w-4 h-4" />
                                            Publier un trajet
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 2. STATISTIQUES CLÉS & KPI */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <StatKpi
                                label="Trajets actifs"
                                value="2 départs"
                                subtext="programmés cette semaine"
                                icon={Car}
                                trend="+1"
                                tint="bg-blue-50 dark:bg-blue-950 text-[#1D63ED]"
                            />
                            <StatKpi
                                label="Trajets complétés"
                                value="24 trajets"
                                subtext="100% de taux de ponctualité"
                                icon={Calendar}
                                tint="bg-emerald-50 dark:bg-emerald-950 text-emerald-600"
                            />
                            <StatKpi
                                label="Passagers transportés"
                                value="58 personnes"
                                subtext="Note moyenne : 4.9/5"
                                icon={Users}
                                trend="+6 ce mois"
                                tint="bg-purple-50 dark:bg-purple-950 text-purple-600"
                            />
                            <StatKpi
                                label="Solde portefeuille"
                                value="45 000 FCFA"
                                subtext="Disponible pour retrait MoMo"
                                icon={Coins}
                                tint="bg-amber-50 dark:bg-amber-950 text-amber-600"
                            />
                        </div>

                        {/* 3. GRILLE PRINCIPALE (CONTENU & WIDGETS LATÉRAUX) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Colonne Gauche : Prochains Trajets & Activité (8 cols) */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Section : Prochains trajets */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                                Vos prochains trajets
                                            </h2>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Gérez vos départs prévus en tant que conducteur ou passager.
                                            </p>
                                        </div>

                                        {/* Filtres de trajets */}
                                        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => setRideFilter('tous')}
                                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                                                    rideFilter === 'tous'
                                                        ? 'bg-white dark:bg-slate-900 text-[#1D63ED] shadow-xs'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                                }`}
                                            >
                                                Tous ({rides.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRideFilter('conducteur')}
                                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                                                    rideFilter === 'conducteur'
                                                        ? 'bg-white dark:bg-slate-900 text-[#1D63ED] shadow-xs'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                                }`}
                                            >
                                                Conducteur (2)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRideFilter('passager')}
                                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                                                    rideFilter === 'passager'
                                                        ? 'bg-white dark:bg-slate-900 text-[#1D63ED] shadow-xs'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                                }`}
                                            >
                                                Passager (1)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Liste des cartes de trajets */}
                                    <div className="space-y-4">
                                        {filteredRides.map((ride) => (
                                            <div
                                                key={ride.id}
                                                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#1D63ED]/50 transition-all bg-slate-50/50 dark:bg-slate-800/40 space-y-4"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                                ride.role === 'conducteur'
                                                                    ? 'bg-blue-100 text-[#1D63ED] dark:bg-blue-950 dark:text-blue-300'
                                                                    : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                                            }`}
                                                        >
                                                            {ride.role === 'conducteur' ? 'Vous conduisez' : 'Vous voyagez'}
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                            {ride.date} à {ride.heure}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                                                            {ride.statut === 'confirme' ? 'Confirmé' : 'En attente'}
                                                        </span>
                                                        <span className="text-sm font-extrabold text-[#1D63ED]">
                                                            {ride.prix.toLocaleString('fr-FR')} FCFA
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Visualisation départ / arrivée */}
                                                <div className="flex items-start gap-3">
                                                    <div className="flex flex-col items-center mt-1">
                                                        <span className="h-2.5 w-2.5 rounded-full bg-[#1D63ED]" />
                                                        <span className="h-5 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 my-0.5" />
                                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                                    </div>
                                                    <div className="flex-1 space-y-1 text-sm">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {ride.depart}
                                                        </div>
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {ride.arrivee}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Détails complémentaires & actions */}
                                                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <div>
                                                        {ride.role === 'conducteur' && ride.passagers ? (
                                                            <span>
                                                                Passagers à bord :{' '}
                                                                <strong className="text-slate-800 dark:text-slate-200">
                                                                    {ride.passagers.join(', ')}
                                                                </strong>{' '}
                                                                ({ride.placesDisponibles} place libre restante)
                                                            </span>
                                                        ) : (
                                                            <span>Véhicule : {ride.vehicule}</span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 text-xs font-semibold rounded-lg border-slate-300 dark:border-slate-700 hover:text-[#1D63ED]"
                                                        >
                                                            Gérer la course
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 px-3 bg-[#1D63ED] hover:bg-[#1552C6] text-white text-xs font-semibold rounded-lg shadow-xs"
                                                        >
                                                            Contacter
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section : Dernières activités & Historique */}
                                <div id="activite" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                        Activité récente
                                    </h2>

                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {RECENT_ACTIVITIES.map((act) => (
                                            <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                                            act.type === 'gain'
                                                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950'
                                                                : act.type === 'reservation'
                                                                ? 'bg-blue-50 text-[#1D63ED] dark:bg-blue-950'
                                                                : 'bg-purple-50 text-purple-600 dark:bg-purple-950'
                                                        }`}
                                                    >
                                                        {act.type === 'gain' ? (
                                                            <Coins className="w-4 h-4" />
                                                        ) : act.type === 'reservation' ? (
                                                            <Users className="w-4 h-4" />
                                                        ) : (
                                                            <Car className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {act.titre}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {act.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    {act.montant && (
                                                        <div className="text-xs font-extrabold text-emerald-600">
                                                            +{act.montant.toLocaleString('fr-FR')} F
                                                        </div>
                                                    )}
                                                    <div className="text-[11px] text-slate-400">{act.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Colonne Droite : Widgets Portefeuille, Véhicule & Sécurité (4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Widget Portefeuille & Solde */}
                                <div id="portefeuille" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                                                <Wallet className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                Mon Portefeuille
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                            Actif
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-xs text-slate-400">Solde disponible</div>
                                        <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                            45 000 <span className="text-sm font-bold text-slate-500">FCFA</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm gap-2">
                                            Retirer via Mobile Money (MoMo / Moov)
                                        </Button>
                                    </div>

                                    <p className="text-[11px] text-slate-400 text-center">
                                        Transferts instantanés 7j/7 sans frais supplémentaires.
                                    </p>
                                </div>

                                {/* Widget Véhicule Enregistré */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-blue-50 text-[#1D63ED] dark:bg-blue-950">
                                                <Car className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                Véhicule actif
                                            </span>
                                        </div>
                                        <Link href="/cars/create">
                                            <span className="text-xs font-semibold text-[#1D63ED] hover:underline">
                                                Modifier
                                            </span>
                                        </Link>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                Toyota Corolla
                                            </span>
                                            <span className="text-[10px] font-bold bg-blue-100 text-[#1D63ED] px-2 py-0.5 rounded-full">
                                                4 places
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            Immatriculation : <span className="font-mono font-bold">AB 1234 RB</span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Assurance & visite technique valides
                                        </div>
                                    </div>
                                </div>

                                {/* Widget Niveau de Confiance & Sécurité */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                Niveau de vérification
                                            </span>
                                        </div>
                                        <span className="text-xs font-extrabold text-emerald-600">100%</span>
                                    </div>

                                    {/* Barre de progression */}
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full w-full" />
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center justify-between">
                                            <span>Carte Nationale d'Identité</span>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Permis de conduire</span>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Numéro de téléphone vérifié</span>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Adresse e-mail confirmée</span>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Widget Assistance Support */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 space-y-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-white/10 text-blue-400">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold">Besoin d'aide ?</h3>
                                            <p className="text-xs text-slate-400">Assistance locale 7j/7</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Une question sur un trajet ou un passager ? Notre équipe support à Cotonou est joignable directement par WhatsApp.
                                    </p>
                                    <a
                                        href="https://wa.me/22900000000"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button className="w-full h-10 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl gap-2">
                                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                                            Contacter sur WhatsApp
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
