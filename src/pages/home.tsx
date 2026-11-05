import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    MapPin,
    Calendar,
    Users,
    ArrowRight,
    ArrowUpDown,
    CheckCircle2,
    ShieldCheck,
    Clock,
    Star,
    Coins,
    Car,
    PlusCircle,
    ChevronDown,
    ChevronUp,
    Menu,
    X,
    Share2,
    Shield,
    Award,
    Navigation,
    Smartphone,
    UserCheck,
    Fuel,
    SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLogoIcon from '@/components/app-logo-icon';
import Footer from '@/components/app-footer';
import MobileNav from '@/components/layout/MobileNav';
import { getStoredUser, isAuthenticated, type AuthUser } from '@/lib/auth-service';

// --- Données statiques réalistes pour le covoiturage au Bénin ---

interface PopularTrip {
    id: string;
    depart: string;
    arrivee: string;
    prix: number;
    duree: string;
    placesDisponibles: number;
    heureDepart: string;
    date: string;
    conducteur: {
        nom: string;
        note: number;
        trajetsEffectues: number;
        vehicule: string;
        verifie: boolean;
    };
    category: 'urbain' | 'interurbain' | 'longue-distance';
    tags: string[];
}

const POPULAR_TRIPS: PopularTrip[] = [
    {
        id: 'trip-1',
        depart: 'Cotonou (Étoile Rouge)',
        arrivee: 'Abomey-Calavi (IITA / Arconville)',
        prix: 1000,
        duree: '30 min',
        placesDisponibles: 2,
        heureDepart: '07:30',
        date: "Aujourd'hui",
        conducteur: {
            nom: 'Patrice A.',
            note: 4.9,
            trajetsEffectues: 148,
            vehicule: 'Toyota Corolla (Climatisée)',
            verifie: true,
        },
        category: 'urbain',
        tags: ['Climatisé', 'Non-fumeur', 'Départ garanti'],
    },
    {
        id: 'trip-2',
        depart: 'Porto-Novo (Carrefour Cinquantenaire)',
        arrivee: 'Cotonou (Ganhi / Marina)',
        prix: 1500,
        duree: '45 min',
        placesDisponibles: 3,
        heureDepart: '06:45',
        date: "Aujourd'hui",
        conducteur: {
            nom: 'Amina K.',
            note: 5.0,
            trajetsEffectues: 92,
            vehicule: 'Hyundai Elantra',
            verifie: true,
        },
        category: 'interurbain',
        tags: ['Climatisé', 'Bagages acceptés', 'Ponctuelle'],
    },
    {
        id: 'trip-3',
        depart: 'Cotonou (Stade de l’Amitié)',
        arrivee: 'Parakou (Gare centrale)',
        prix: 9000,
        duree: '5h 30',
        placesDisponibles: 1,
        heureDepart: '06:00',
        date: 'Demain',
        conducteur: {
            nom: 'Maxime T.',
            note: 4.8,
            trajetsEffectues: 215,
            vehicule: 'Peugeot 3008',
            verifie: true,
        },
        category: 'longue-distance',
        tags: ['Trajet direct', 'Grand coffre', 'Pause déjeuner'],
    },
    {
        id: 'trip-4',
        depart: 'Cotonou (Cadjehoun)',
        arrivee: 'Ouidah (Place Chacha)',
        prix: 2000,
        duree: '40 min',
        placesDisponibles: 4,
        heureDepart: '14:00',
        date: "Aujourd'hui",
        conducteur: {
            nom: 'Christian D.',
            note: 4.9,
            trajetsEffectues: 67,
            vehicule: 'Kia Sportage',
            verifie: true,
        },
        category: 'interurbain',
        tags: ['Climatisé', 'Confort premium'],
    },
    {
        id: 'trip-5',
        depart: 'Cotonou (Akpakpa)',
        arrivee: 'Bohicon (Carrefour Dako)',
        prix: 4500,
        duree: '2h 15',
        placesDisponibles: 2,
        heureDepart: '08:15',
        date: 'Demain',
        conducteur: {
            nom: 'Bélinda S.',
            note: 4.9,
            trajetsEffectues: 110,
            vehicule: 'Renault Duster',
            verifie: true,
        },
        category: 'longue-distance',
        tags: ['Véhicule spacieux', 'Climatisé'],
    },
    {
        id: 'trip-6',
        depart: 'Abomey-Calavi (Campus UAC)',
        arrivee: 'Cotonou (Haie Vive)',
        prix: 1000,
        duree: '25 min',
        placesDisponibles: 3,
        heureDepart: '17:30',
        date: "Aujourd'hui",
        conducteur: {
            nom: 'Romaric M.',
            note: 4.7,
            trajetsEffectues: 84,
            vehicule: 'Honda Civic',
            verifie: true,
        },
        category: 'urbain',
        tags: ['Climatisé', 'Retour bureau'],
    },
];

const QUICK_CITIES = ['Cotonou', 'Abomey-Calavi', 'Porto-Novo', 'Parakou', 'Ouidah', 'Bohicon'];

const TESTIMONIALS = [
    {
        id: 1,
        nom: 'Roland Agossou',
        role: 'Conducteur régulier (Calavi - Cotonou)',
        trajets: '120+ trajets',
        note: 5,
        commentaire:
            'MoveTogether a complètement amorti mes frais de carburant quotidiens. Je voyageais souvent seul le matin dans les embouteillages. Désormais, je partage mes places avec des cadres courtois et je gagne près de 55 000 FCFA par mois.',
        initiales: 'RA',
    },
    {
        id: 2,
        nom: 'Christelle Dossou',
        role: 'Passagère (Porto-Novo - Cotonou)',
        trajets: '45 trajets',
        note: 5,
        commentaire:
            'Fini le stress des gares routières et des taxis surchargés. Je réserve ma place la veille, le véhicule est climatisé et le conducteur est ponctuel au point de rendez-vous. La sécurité des profils vérifiés est rassurante.',
        initiales: 'CD',
    },
    {
        id: 3,
        nom: 'Marc-Aurèle Kpadonou',
        role: 'Consultant & Passager longue distance',
        trajets: '28 trajets',
        note: 5,
        commentaire:
            'Pour mes déplacements professionnels entre Cotonou et Parakou, MoveTogether est devenu mon réflexe N°1. Les véhicules sont confortables, les prix transparents et le paiement Mobile Money sans accroc.',
        initiales: 'MK',
    },
];

const FAQ_ITEMS = [
    {
        question: 'Comment réserver un trajet sur MoveTogether ?',
        answer: 'Renseignez simplement votre ville de départ, votre destination et la date souhaitée dans notre barre de recherche. Sélectionnez ensuite le trajet qui correspond le mieux à vos horaires et confirmez votre réservation en ligne ou contactez le conducteur.',
    },
    {
        question: 'Comment sont fixés les prix des trajets ?',
        answer: 'Les tarifs sont proposés par les conducteurs selon un barème équitable MoveTogether qui calcule le partage réel des frais de carburant et de péage, sans aucune spéculation commerciale.',
    },
    {
        question: 'Comment MoveTogether assure-t-il la sécurité des passagers ?',
        answer: 'Chaque conducteur fait l’objet d’une vérification d’identité rigoureuse (carte nationale d’identité ou passeport, permis de conduire et papiers du véhicule). De plus, notre communauté repose sur des avis authentiques déposés après chaque trajet.',
    },
    {
        question: 'Comment puis-je annuler ou modifier ma réservation ?',
        answer: 'Vous pouvez gérer vos réservations en toute autonomie depuis votre tableau de bord personnel. En cas d’annulation préalable dans les délais impartis, le remboursement ou le réajustement s’effectue automatiquement.',
    },
    {
        question: 'Quels sont les moyens de paiement acceptés ?',
        answer: 'Nous prenons en charge les paiements sécurisés par Mobile Money (MTN MoMo, Moov Money) ainsi que les cartes bancaires Visa et Mastercard.',
    },
];

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Formulaire de recherche
    const [depart, setDepart] = useState('');
    const [arrivee, setArrivee] = useState('');
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [places, setPlaces] = useState(1);

    // Filtre des trajets populaires
    const [activeCategory, setActiveCategory] = useState<'tous' | 'urbain' | 'interurbain' | 'longue-distance'>('tous');

    // Onglet Passager / Conducteur
    const [activeTab, setActiveTab] = useState<'passager' | 'conducteur'>('passager');

    // Simulateur conducteur
    const [distanceKm, setDistanceKm] = useState(160);
    const [passagersSimu, setPassagersSimu] = useState(3);

    // FAQ active
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    useEffect(() => {
        const authenticated = isAuthenticated();
        setIsLoggedIn(authenticated);
        if (authenticated) {
            setUser(getStoredUser());
        }
    }, []);

    // Inverser la ville de départ et la destination
    const handleSwapCities = () => {
        const temp = depart;
        setDepart(arrivee);
        setArrivee(temp);
    };

    // Soumission de la recherche
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (depart) params.set('depart', depart);
        if (arrivee) params.set('arrivee', arrivee);
        if (date) params.set('date', date);
        if (places) params.set('places', places.toString());

        navigate(`/rides/search?${params.toString()}`);
    };

    // Calcul des économies mensuelles estimées (base : ~125 FCFA / km / passager)
    const economieMensuelle = Math.round(distanceKm * passagersSimu * 120 * 4);

    // Filtrer les trajets
    const filteredTrips = POPULAR_TRIPS.filter((t) => {
        if (activeCategory === 'tous') return true;
        return t.category === activeCategory;
    });

    return (
        <>
            <Head title="MoveTogether - Covoiturage fiable et économique au Bénin" />

            <div className="min-h-screen bg-[#EEF2F8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
                {/* 1. HEADER / NAVIGATION BAR MODERNE */}
                <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D63ED] text-white shadow-md shadow-blue-500/20 group-hover:bg-[#1552C6] transition-all">
                                    <AppLogoIcon className="h-5 w-5 fill-current text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                                        Move<span className="text-[#1D63ED]">Together</span>
                                    </span>
                                    <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
                                        Covoiturage vérifié
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Desktop */}
                        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <a href="#recherche" className="hover:text-[#1D63ED] dark:hover:text-blue-400 transition-colors">
                                Rechercher
                            </a>
                            {/* <a href="#trajets-populaires" className="hover:text-[#1D63ED] dark:hover:text-blue-400 transition-colors">
                                Trajets populaires
                            </a> */}
                            <a href="#comment-ca-marche" className="hover:text-[#1D63ED] dark:hover:text-blue-400 transition-colors">
                                Comment ça marche
                            </a>
                            <a href="#simulateur" className="hover:text-[#1D63ED] dark:hover:text-blue-400 transition-colors">
                                Simulateur
                            </a>
                            <a href="#securite" className="hover:text-[#1D63ED] dark:hover:text-blue-400 transition-colors">
                                Sécurité
                            </a>
                            <a href="#avis" className="hover:text-[#1D63ED] dark:hover:text-blue-400 transition-colors">
                                Avis
                            </a>
                        </nav>

                        {/* Actions Utilisateur Desktop */}
                        <div className="hidden sm:flex items-center gap-3">
                            <Link href="/rides/verify-before-publish">
                                <Button
                                    variant="ghost"
                                    className="text-slate-700 dark:text-slate-200 hover:text-[#1D63ED] hover:bg-blue-50/70 dark:hover:bg-blue-950/40 font-medium text-sm gap-2"
                                >
                                    <PlusCircle className="w-4 h-4 text-[#1D63ED]" />
                                    Publier un trajet
                                </Button>
                            </Link>

                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                            {isLoggedIn ? (
                                <Link href="/dashboard">
                                    <Button className="bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold rounded-xl text-sm px-4 h-9 shadow-sm shadow-blue-500/20 gap-2">
                                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                                            {user?.firstname ? user.firstname.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        Tableau de bord
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login">
                                        <Button
                                            variant="ghost"
                                            className="text-slate-700 dark:text-slate-200 hover:text-[#1D63ED] font-medium text-sm"
                                        >
                                            Connexion
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className="bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold rounded-xl text-sm px-4 h-9 shadow-sm shadow-blue-500/20">
                                            Inscription
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Burger Menu Mobile */}
                        <div className="lg:hidden flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Tiroir Mobile */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4">
                            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                <a
                                    href="#recherche"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Rechercher un trajet
                                </a>
                                {/* <a
                                    href="#trajets-populaires"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Trajets populaires
                                </a> */}
                                <a
                                    href="#comment-ca-marche"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Comment ça marche
                                </a>
                                <a
                                    href="#simulateur"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Simulateur conducteur
                                </a>
                                <a
                                    href="#securite"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Charte de sécurité
                                </a>
                                <a
                                    href="#avis"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Avis de la communauté
                                </a>
                            </nav>

                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                                <Link href="/rides/verify-before-publish" className="w-full">
                                    <Button variant="outline" className="w-full justify-center gap-2">
                                        <PlusCircle className="w-4 h-4 text-[#1D63ED]" />
                                        Proposer un trajet
                                    </Button>
                                </Link>

                                {isLoggedIn ? (
                                    <Link href="/dashboard" className="w-full">
                                        <Button className="w-full bg-[#1D63ED] text-white">
                                            Tableau de bord
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link href="/login" className="w-full">
                                            <Button variant="outline" className="w-full">
                                                Connexion
                                            </Button>
                                        </Link>
                                        <Link href="/register" className="w-full">
                                            <Button className="w-full bg-[#1D63ED] text-white">
                                                Inscription
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                <main className="flex-1">
                    {/* 2. HERO SECTION PROFESSIONNELLE */}
                    <section id="recherche" className="relative overflow-hidden bg-gradient-to-b from-blue-100/40 via-[#EEF2F8] to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 pt-12 pb-20 sm:pt-20 sm:pb-28">
                        {/* Motifs géométriques décoratifs */}
                        <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Badge de réassurance */}
                            {/* <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-blue-200/70 dark:border-blue-900/40 shadow-xs text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    <span className="flex h-2 w-2 rounded-full bg-[#1D63ED] animate-pulse" />
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#1D63ED]" />
                                    Plateforme de covoiturage de référence au Bénin & en Afrique de l’Ouest
                                </div>
                            </div> */}

                            {/* Titre Principal */}
                            <div className="text-center max-w-4xl mx-auto space-y-4">
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-tight">
                                    Voyagez en toute sérénité,{' '}
                                    <span className="relative inline-block text-[#1D63ED]">
                                        au juste prix.
                                        <svg
                                            className="absolute left-0 -bottom-2 w-full h-2 text-[#1D63ED]/30"
                                            viewBox="0 0 100 8"
                                            preserveAspectRatio="none"
                                        >
                                            <path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                                        </svg>
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                    Partagez vos trajets du quotidien et interurbains entre Cotonou, Calavi, Porto-Novo, Parakou et au-delà. Économisez, voyagez confortablement et en toute confiance.
                                </p>
                            </div>

                            {/* CONSOLE DE RECHERCHE FLOTTANTE */}
                            <div className="mt-10 sm:mt-12 max-w-5xl mx-auto">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800">
                                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                            {/* Ville de départ */}
                                            <div className="md:col-span-4 relative">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-[#1D63ED]" />
                                                    Lieu de départ
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Ex: Cotonou, Étoile Rouge"
                                                    value={depart}
                                                    onChange={(e) => setDepart(e.target.value)}
                                                    required
                                                    className="h-12 text-sm bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#1D63ED] focus:ring-2 focus:ring-[#1D63ED]/20"
                                                />
                                            </div>

                                            {/* Bouton d'inversion des villes */}
                                            <div className="md:col-span-1 flex justify-center -my-1 md:my-0">
                                                <button
                                                    type="button"
                                                    onClick={handleSwapCities}
                                                    title="Inverser départ et destination"
                                                    className="p-2.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#1D63ED] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 shadow-xs"
                                                >
                                                    <ArrowUpDown className="w-4 h-4 hidden md:block rotate-90" />
                                                    <ArrowUpDown className="w-4 h-4 md:hidden" />
                                                </button>
                                            </div>

                                            {/* Destination */}
                                            <div className="md:col-span-4 relative">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                                                    <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                                                    Destination
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Ex: Abomey-Calavi, UAC"
                                                    value={arrivee}
                                                    onChange={(e) => setArrivee(e.target.value)}
                                                    required
                                                    className="h-12 text-sm bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#1D63ED] focus:ring-2 focus:ring-[#1D63ED]/20"
                                                />
                                            </div>

                                            {/* Date de départ */}
                                            <div className="md:col-span-3">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                                    Date du trajet
                                                </label>
                                                <Input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="h-12 text-sm bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#1D63ED] focus:ring-2 focus:ring-[#1D63ED]/20"
                                                />
                                            </div>
                                        </div>

                                        {/* Deuxième rangée : passagers et bouton de recherche */}
                                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                                            {/* Sélecteur de places */}
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    Places souhaitées :
                                                </label>
                                                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            onClick={() => setPlaces(num)}
                                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                                                                places === num
                                                                    ? 'bg-[#1D63ED] text-white shadow-xs'
                                                                    : 'text-slate-600 dark:text-slate-300 hover:text-[#1D63ED]'
                                                            }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Bouton de recherche principal */}
                                            <Button
                                                type="submit"
                                                className="h-12 px-8 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-bold rounded-xl text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all"
                                            >
                                                <Search className="w-5 h-5" />
                                                Rechercher un trajet
                                            </Button>
                                        </div>
                                    </form>

                                    {/* Suggestions de villes rapides */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-medium text-slate-400">Villes fréquentes :</span>
                                        {QUICK_CITIES.map((city) => (
                                            <button
                                                key={city}
                                                type="button"
                                                onClick={() => {
                                                    if (!depart) setDepart(city);
                                                    else if (!arrivee) setArrivee(city);
                                                    else setDepart(city);
                                                }}
                                                className="text-xs font-medium text-slate-600 hover:text-[#1D63ED] dark:text-slate-300 dark:hover:text-blue-400 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                                            >
                                                {city}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Piliers de réassurance sous la barre */}
                                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        Conducteurs 100% vérifiés
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        <Coins className="w-4 h-4 text-[#1D63ED] shrink-0" />
                                        Économies jusqu'à 70%
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                                        Paiement sécurisé garanti
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                        Réservation en 2 minutes
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. SECTION STATISTIQUES D'IMPACT */}
                    <section className="border-y border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
                                <div className="text-center pt-4 lg:pt-0">
                                    <div className="text-3xl sm:text-4xl font-extrabold text-[#1D63ED]">50 000+</div>
                                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        Passagers transportés
                                    </div>
                                </div>
                                <div className="text-center pt-4 lg:pt-0">
                                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">120 000+</div>
                                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        Trajets réalisés avec succès
                                    </div>
                                </div>
                                <div className="text-center pt-4 lg:pt-0">
                                    <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                                        4.9/5 <Star className="w-5 h-5 fill-current text-amber-400" />
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        Note moyenne de satisfaction
                                    </div>
                                </div>
                                <div className="text-center pt-4 lg:pt-0">
                                    <div className="text-3xl sm:text-4xl font-extrabold text-purple-600">35 tonnes</div>
                                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        D'émissions de CO2 évitées
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. TRAJETS POPULAIRES EN DIRECT */}
                    <section id="trajets-populaires" className="py-20 bg-[#EEF2F8] dark:bg-slate-950">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-[#1D63ED] mb-2">
                                        Départs quotidiens
                                    </div>
                                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                        Trajets les plus demandés
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                                        Consultez les trajets fréquents proposés par nos conducteurs certifiés.
                                    </p>
                                </div>

                                {/* Filtres de catégories */}
                                <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 self-start md:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory('tous')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            activeCategory === 'tous'
                                                ? 'bg-[#1D63ED] text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-[#1D63ED]'
                                        }`}
                                    >
                                        Tous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory('urbain')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            activeCategory === 'urbain'
                                                ? 'bg-[#1D63ED] text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-[#1D63ED]'
                                        }`}
                                    >
                                        Urbains
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory('interurbain')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            activeCategory === 'interurbain'
                                                ? 'bg-[#1D63ED] text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-[#1D63ED]'
                                        }`}
                                    >
                                        Interurbains
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory('longue-distance')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                            activeCategory === 'longue-distance'
                                                ? 'bg-[#1D63ED] text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-[#1D63ED]'
                                        }`}
                                    >
                                        Longue distance
                                    </button>
                                </div>
                            </div>

                            {/* Cartes de Trajets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTrips.map((trip) => (
                                    <div
                                        key={trip.id}
                                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                                    >
                                        <div>
                                            {/* En-tête de la carte */}
                                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-[#1D63ED]" />
                                                    {trip.date} à {trip.heureDepart}
                                                </span>
                                                <span className="bg-blue-50 dark:bg-blue-950/50 text-[#1D63ED] px-2.5 py-0.5 rounded-full font-bold">
                                                    {trip.duree}
                                                </span>
                                            </div>

                                            {/* Parcours visuel du trajet */}
                                            <div className="space-y-3 mb-5">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex flex-col items-center mt-1">
                                                        <span className="h-3 w-3 rounded-full bg-[#1D63ED] ring-4 ring-blue-100 dark:ring-blue-950" />
                                                        <span className="h-6 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 my-0.5" />
                                                        <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                                                    </div>
                                                    <div className="flex-1 space-y-3">
                                                        <div>
                                                            <div className="text-xs text-slate-400">Départ</div>
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                                                {trip.depart}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-400">Arrivée</div>
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                                                {trip.arrivee}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Informations Conducteur */}
                                            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-9 w-9 rounded-full bg-[#1D63ED]/10 text-[#1D63ED] flex items-center justify-center font-bold text-xs">
                                                        {trip.conducteur.nom.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                                            {trip.conducteur.nom}
                                                            {trip.conducteur.verifie && (
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            {trip.conducteur.vehicule}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                                                    {trip.conducteur.note}
                                                </div>
                                            </div>

                                            {/* Badges / Tags */}
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {trip.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pied de carte : Prix et réservation */}
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-slate-400">Tarif par place</div>
                                                <div className="text-lg font-black text-[#1D63ED]">
                                                    {trip.prix.toLocaleString('fr-FR')} FCFA
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {trip.placesDisponibles} place{trip.placesDisponibles > 1 ? 's' : ''}
                                                </span>
                                                <Link href={`/rides/search?depart=${encodeURIComponent(trip.depart)}&arrivee=${encodeURIComponent(trip.arrivee)}`}>
                                                    <Button className="h-9 px-3.5 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold text-xs rounded-xl shadow-xs">
                                                        Réserver
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bouton pour voir tous les trajets */}
                            <div className="mt-12 text-center">
                                <Link href="/rides/search">
                                    <Button
                                        variant="outline"
                                        className="h-11 px-8 rounded-xl border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:text-[#1D63ED] gap-2"
                                    >
                                        Consulter tous les trajets disponibles
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* 5. DOUBLE PROPOSITION DE VALEUR (PASSAGER VS CONDUCTEUR) */}
                    <section id="avantages" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-3xl mx-auto mb-12">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#1D63ED] mb-2">
                                    Une solution pensée pour tous
                                </div>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                    MoveTogether selon vos besoins
                                </h2>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
                                    Que vous cherchiez un trajet confortable ou que vous souhaitiez rentabiliser votre voiture, découvrez vos avantages.
                                </p>

                                {/* Switcher Passager / Conducteur */}
                                <div className="mt-8 inline-flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('passager')}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            activeTab === 'passager'
                                                ? 'bg-white dark:bg-slate-900 text-[#1D63ED] shadow-sm'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        Je suis Passager
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('conducteur')}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            activeTab === 'conducteur'
                                                ? 'bg-white dark:bg-slate-900 text-[#1D63ED] shadow-sm'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        Je suis Conducteur
                                    </button>
                                </div>
                            </div>

                            {/* Contenu dynamique Passager / Conducteur */}
                            {activeTab === 'passager' ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-[#1D63ED] flex items-center justify-center font-bold">
                                            <Coins className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Économies garanties</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Jusqu’à 70% moins cher qu'une course privée ou un taxi classique, avec des tarifs connus à l'avance sans surprise.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center font-bold">
                                            <Car className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confort & Climatisation</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Voyagez dans des voitures personnelles bien entretenues, avec place assise réservée et climatisation assurée.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 flex items-center justify-center font-bold">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Départs directs et réguliers</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Plus besoin d’attendre que le bus se remplisse. Les départs s’effectuent à heure fixe depuis des points de ralliement pratiques.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 flex items-center justify-center font-bold">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confiance et Sécurité</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Chaque conducteur est certifié avec pièce d'identité et permis. Les évaluations mutuelles garantissent la courtoisie.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center font-bold">
                                            <Fuel className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Amortissez votre carburant</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Partagez les frais d’essence et de péage sur vos itinéraires habituels sans modifier vos habitudes de déplacement.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-[#1D63ED] flex items-center justify-center font-bold">
                                            <SlidersHorizontal className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contrôle absolu</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Vous fixez vos horaires, vos points d'arrêt et le nombre de passagers acceptés. Vous validez chaque profil.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 flex items-center justify-center font-bold">
                                            <Smartphone className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Paiements automatiques</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Recevez vos contributions directement sur votre compte Mobile Money ou bancaire dès la fin du voyage.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 flex items-center justify-center font-bold">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Communauté respectueuse</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Rencontrez des professionnels et étudiants courtois. Fini les voyages solitaires et ennuyeux dans les bouchons.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Bouton d'action sous la section avantages */}
                            <div className="mt-10 text-center">
                                {activeTab === 'passager' ? (
                                    <Link href="/rides/search">
                                        <Button className="h-11 px-8 rounded-xl bg-[#1D63ED] hover:bg-[#1552C6] text-white font-bold text-sm shadow-md shadow-blue-500/20 gap-2">
                                            Trouver un trajet maintenant <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/rides/verify-before-publish">
                                        <Button className="h-11 px-8 rounded-xl bg-[#1D63ED] hover:bg-[#1552C6] text-white font-bold text-sm shadow-md shadow-blue-500/20 gap-2">
                                            Publier un trajet conducteur <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 6. COMMENT ÇA MARCHE */}
                    <section id="comment-ca-marche" className="py-20 bg-[#EEF2F8] dark:bg-slate-950">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#1D63ED] mb-2">
                                    Simplicité & Rapidité
                                </div>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                    Comment ça marche ?
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                                    En seulement trois étapes simples, commencez à covoiturer en toute sérénité.
                                </p>
                            </div>

                            <div className="relative grid md:grid-cols-3 gap-8">
                                {/* Ligne pointillée décorative desktop */}
                                <div
                                    className="hidden md:block absolute top-16 left-[18%] right-[18%] border-t-2 border-dashed border-[#1D63ED]/20 dark:border-blue-500/20 pointer-events-none"
                                    aria-hidden="true"
                                />

                                {/* Étape 1 */}
                                <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-[#1D63ED] flex items-center justify-center mx-auto text-xl font-black">
                                        1
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Recherchez ou proposez
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        Entrez votre itinéraire en tant que passager ou publiez vos sièges disponibles en 1 minute si vous prenez le volant.
                                    </p>
                                </div>

                                {/* Étape 2 */}
                                <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center mx-auto text-xl font-black">
                                        2
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Réservez en ligne
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        Sélectionnez le trajet correspondant à vos critères, validez la réservation et réglez en toute sécurité via Mobile Money.
                                    </p>
                                </div>

                                {/* Étape 3 */}
                                <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 flex items-center justify-center mx-auto text-xl font-black">
                                        3
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Voyagez & Partagez
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        Retrouvez votre covoitureur au point de rendez-vous convenu, profitez de la route et notez l'expérience à l'arrivée.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 7. SIMULATEUR D'ÉCONOMIES CONDUCTEUR */}
                    <section id="simulateur" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-gradient-to-br from-slate-900 via-[#0F2D6B] to-[#1D63ED] rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-blue-900/10 grid lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
                                        <Fuel className="w-3.5 h-3.5 text-blue-300" />
                                        Simulateur pour conducteurs
                                    </div>

                                    <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                                        Combien pouvez-vous économiser chaque mois ?
                                    </h2>

                                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                                        Chaque jour, vos sièges vides peuvent financer votre carburant et vos entretiens réguliers. Ajustez vos trajets pour voir le montant de vos économies :
                                    </p>

                                    {/* Commandes du simulateur */}
                                    <div className="space-y-5 pt-2 max-w-lg">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-blue-200 mb-2">
                                                <span>Distance parcourue par semaine :</span>
                                                <span className="text-white text-sm">{distanceKm} km</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="40"
                                                max="600"
                                                step="20"
                                                value={distanceKm}
                                                onChange={(e) => setDistanceKm(Number(e.target.value))}
                                                className="w-full accent-[#1D63ED] cursor-pointer"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-blue-200 mb-2">
                                                <span>Nombre de passagers transportés :</span>
                                                <span className="text-white text-sm">{passagersSimu} passager{passagersSimu > 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[1, 2, 3, 4].map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setPassagersSimu(num)}
                                                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                                                            passagersSimu === num
                                                                ? 'bg-white text-[#1D63ED] shadow-sm'
                                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                        }`}
                                                    >
                                                        {num} place{num > 1 ? 's' : ''}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Résultat d'estimation */}
                                <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center space-y-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                                        Économies mensuelles estimées
                                    </div>
                                    <div className="text-4xl sm:text-5xl font-black text-white">
                                        {economieMensuelle.toLocaleString('fr-FR')} <span className="text-xl sm:text-2xl text-blue-200 font-bold">FCFA</span>
                                    </div>
                                    <p className="text-xs text-blue-200/90 leading-relaxed">
                                        Soit environ {(economieMensuelle * 12).toLocaleString('fr-FR')} FCFA d'économies annuelles sur vos frais de transport habituels.
                                    </p>

                                    <div className="pt-3">
                                        <Link href="/rides/verify-before-publish" className="block w-full">
                                            <Button className="w-full h-12 bg-white text-[#1D63ED] hover:bg-blue-50 font-extrabold text-sm rounded-xl shadow-lg">
                                                Commencer à rentabiliser mes trajets
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 8. SÉCURITÉ & CONFIANCE (CHARTE QUALITÉ) */}
                    <section id="securite" className="py-20 bg-[#EEF2F8] dark:bg-slate-950">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-3xl mx-auto mb-14">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#1D63ED] mb-2">
                                    Notre priorité absolue
                                </div>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                    La sécurité au cœur de chaque trajet
                                </h2>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
                                    Nous mettons en place des protocoles stricts pour que chaque membre voyage l'esprit tranquille.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1D63ED] flex items-center justify-center font-bold">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Profils 100% vérifiés</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Pièce d'identité nationale (CIP/CNI), permis de conduire valide et immatriculation contrôlés avant toute publication.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Avis transparents</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Évaluations et notes bilatérales authentiques déposées exclusivement par des usagers ayant voyagé ensemble.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                                        <Share2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Traçabilité du trajet</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Partagez le lien de votre trajet en direct et les coordonnées de votre conducteur avec vos proches en 1 clic.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Assistance 7j/7</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Une équipe support basée à Cotonou disponible par WhatsApp et appel téléphonique pour répondre à vos questions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 9. TÉMOIGNAGES & AVIS DE LA COMMUNAUTÉ */}
                    <section id="avis" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-14">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#1D63ED] mb-2">
                                    Retours d’expérience
                                </div>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                    Ce que dit notre communauté
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                                    Découvrez les témoignages de ceux qui partagent la route chaque semaine.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {TESTIMONIALS.map((t) => (
                                    <div
                                        key={t.id}
                                        className="bg-slate-50 dark:bg-slate-800/60 p-6 sm:p-8 rounded-3xl border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
                                    >
                                        <div className="space-y-4">
                                            {/* Note étoiles */}
                                            <div className="flex items-center gap-1 text-amber-400">
                                                {Array.from({ length: t.note }).map((_, idx) => (
                                                    <Star key={idx} className="w-4 h-4 fill-current" />
                                                ))}
                                            </div>

                                            {/* Citation */}
                                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">
                                                "{t.commentaire}"
                                            </p>
                                        </div>

                                        {/* Profil auteur */}
                                        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-[#1D63ED] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                                {t.initiales}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {t.nom}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    {t.role}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 10. FAQ INTERACTIVE */}
                    <section className="py-20 bg-[#EEF2F8] dark:bg-slate-950">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#1D63ED] mb-2">
                                    Questions courantes
                                </div>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                    Foire aux questions
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                                    Tout ce que vous devez savoir pour démarrer avec MoveTogether.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {FAQ_ITEMS.map((item, index) => {
                                    const isOpen = openFaqIndex === index;
                                    return (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                                className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-[#1D63ED] dark:hover:text-blue-400 transition-colors"
                                            >
                                                <span>{item.question}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-5 h-5 text-[#1D63ED] shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                                                )}
                                            </button>

                                            {isOpen && (
                                                <div className="px-6 pb-5 pt-1 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800">
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* 11. BANNIÈRE CTA CONDUCTEUR & PASSAGER */}
                    <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-gradient-to-r from-[#1D63ED] to-[#245FDB] rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-blue-600/20 flex flex-col lg:flex-row items-center justify-between gap-8">
                                <div className="space-y-3 text-center lg:text-left max-w-2xl">
                                    <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                                        Prêt à transformer vos trajets quotidiens ?
                                    </h2>
                                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                                        Rejoignez dès maintenant des milliers de Béninois qui voyagent mieux et dépensent moins.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <Link href="/register" className="w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-blue-50 text-[#1D63ED] font-bold text-sm rounded-xl shadow-md">
                                            Créer mon compte gratuit
                                        </Button>
                                    </Link>
                                    <Link href="/rides/verify-before-publish" className="w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto h-12 px-8 border-white/40 text-white hover:bg-white/10 font-bold text-sm rounded-xl"
                                        >
                                            Proposer un trajet
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 12. FOOTER OFFICIEL */}
                <Footer />

                {/* 13. NAVIGATION MOBILE FLOTTANTE */}
                <MobileNav />
            </div>
        </>
    );
}
