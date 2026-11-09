import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    PlusCircle,
    Car,
    User,
    ShieldCheck,
    FileText,
    Wallet,
    History,
    ExternalLink,
    LogOut,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    getStoredUser,
    fetchCurrentUser,
    logoutUser,
    clearAuth,
    type AuthUser,
} from '@/lib/auth-service';
import { resolveAuthenticatedFileUrl } from '@/lib/secure-file';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
    badgeColor?: string;
    isExternal?: boolean;
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

export interface SidebarProps {
    /** Contrôle l'ouverture sur mobile */
    isOpen?: boolean;
    onClose?: () => void;
    /** Mode réduit (icônes seules) sur desktop */
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    /** Chemin actif (défaut : location.pathname) */
    activePath?: string;
    /** Passer un user déjà récupéré pour éviter le fetch */
    customUser?: AuthUser | null;
    /** Sections supplémentaires spécifiques à la page */
    extraSections?: NavSection[];
    /** Titres des sections par défaut à masquer */
    hideDefaultSections?: string[];
}

// ─── Navigation par défaut ───────────────────────────────────────────────────

const DEFAULT_SECTIONS: NavSection[] = [
    {
        title: 'Menu Principal',
        items: [
            { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
            { label: 'Rechercher un trajet', href: '/rides/search', icon: Search },
            {
                label: 'Publier un trajet',
                href: '/rides/verify-before-publish',
                icon: PlusCircle,
                badge: 'Nouveau',
                badgeColor: 'bg-blue-50 text-[#1D63ED] dark:bg-blue-950/60 dark:text-blue-300',
            },
            { label: 'Mes véhicules', href: '/cars/create', icon: Car },
        ],
    },
    {
        title: 'Services & Documents',
        items: [
            { label: "Pièce d'identité (CIP)", href: '/uploadProfile', icon: FileText },
            { label: 'Permis & Documents', href: '/documents/create', icon: ShieldCheck },
            {
                label: 'Portefeuille',
                href: '/dashboard#portefeuille',
                icon: Wallet,
                badge: 'Actif',
                badgeColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
            },
            { label: 'Historique des courses', href: '/dashboard#activite', icon: History },
        ],
    },
    {
        title: 'Compte & Paramètres',
        items: [
            { label: 'Mon profil & Identité', href: '/settings/profile', icon: User },
            { label: 'Sécurité & Sessions', href: '/settings/security', icon: ShieldCheck },
            { label: 'Retour au site public', href: '/', icon: ExternalLink },
        ],
    },
];

// ─── Composant ───────────────────────────────────────────────────────────────

export default function Sidebar({
    isOpen = false,
    onClose,
    collapsed = false,
    activePath,
    customUser,
    extraSections,
    hideDefaultSections,
}: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<AuthUser | null>(customUser ?? null);

    const currentPath = activePath || location.pathname;

    // Sections fusionnées
    const sections: NavSection[] = [
        ...(hideDefaultSections
            ? DEFAULT_SECTIONS.filter((sec) => !hideDefaultSections.includes(sec.title))
            : DEFAULT_SECTIONS),
        ...(extraSections ?? []),
    ];

    // Charge le user depuis le cache local puis rafraîchit depuis le serveur
    useEffect(() => {
        if (customUser !== undefined) {
            setUser(customUser);
            return;
        }
        const stored = getStoredUser();
        if (stored) setUser(stored);

        fetchCurrentUser().then((res) => {
            if (res.success && res.user) setUser(res.user);
        });
    }, [customUser]);

    const handleLogout = async () => {
        await logoutUser();
        clearAuth();
        navigate('/login', { replace: true });
    };

    const displayName =
        [user?.firstname, user?.lastname].filter(Boolean).join(' ') ||
        user?.name ||
        user?.email ||
        'Membre MoveTogether';

    // Priorité : photo de profil uploadée > avatar OAuth > initiales
    const rawAvatarUrl = user?.photoIdentite || (user as any)?.avatar_url || null;
    const avatarUrl = resolveAuthenticatedFileUrl(rawAvatarUrl);

    const isItemActive = (href: string) => {
        if (href === currentPath) return true;
        if (
            href === '/rides/verify-before-publish' &&
            (currentPath === '/rides/create' || currentPath === '/rides/verify-before-publish')
        )
            return true;
        return false;
    };

    return (
        <>
            {/* Backdrop mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar fixe */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${collapsed ? 'lg:w-20' : 'w-64 lg:w-72'}`}
            >
                {/* ── Header ── */}
                <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200/80 dark:border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1D63ED] text-white shadow-md shadow-blue-500/20">
                            <AppLogoIcon className="h-5 w-5 fill-current text-white" />
                        </div>
                        {!collapsed && (
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

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                            aria-label="Fermer le menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* ── Navigation ── */}
                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            {!collapsed && (
                                <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    {section.title}
                                </p>
                            )}
                            <nav className="space-y-1">
                                {section.items.map((item, itemIdx) => {
                                    const active = isItemActive(item.href);
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={itemIdx}
                                            href={item.href}
                                            onClick={() => onClose?.()}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                                                active
                                                    ? 'bg-[#1D63ED] text-white font-bold shadow-sm shadow-blue-500/20'
                                                    : 'text-slate-600 dark:text-slate-300 hover:text-[#1D63ED] hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Icon
                                                    className={`w-5 h-5 shrink-0 ${
                                                        active
                                                            ? 'text-white'
                                                            : 'text-slate-400'
                                                    }`}
                                                />
                                                {!collapsed && (
                                                    <span className="truncate">{item.label}</span>
                                                )}
                                            </div>

                                            {!collapsed && item.badge && !active && (
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        item.badgeColor || 'bg-blue-50 text-[#1D63ED]'
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* ── Footer : avatar + déconnexion ── */}
                <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
                        >
                            {/* Avatar : photo si dispo, sinon initiales */}
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-[#1D63ED] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getInitials(displayName)
                                )}
                            </div>
                            {!collapsed && (
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">
                                        {displayName}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        {user?.email || 'compte@movetogether.bj'}
                                    </p>
                                </div>
                            )}
                        </Link>

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
        </>
    );
}
