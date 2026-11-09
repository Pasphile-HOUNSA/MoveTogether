import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, ChevronRight, Bell, PlusCircle } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { getStoredUser } from '@/lib/auth-service';
import { resolveAuthenticatedFileUrl } from '@/lib/secure-file';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface DashboardLayoutProps {
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
    headerActions?: React.ReactNode;
    children: React.ReactNode;
    activePath?: string;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export default function DashboardLayout({
    title,
    breadcrumbs,
    headerActions,
    children,
    activePath,
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const user = getStoredUser();
    const displayName =
        [user?.firstname, user?.lastname].filter(Boolean).join(' ') ||
        user?.name ||
        user?.email ||
        'Membre';

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans">
            {/* 1. Sidebar réutilisable */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                activePath={activePath}
            />

            {/* 2. Zone Principale */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                    sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                }`}
            >
                {/* Header Supérieur Universel */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/90">
                    {/* Gauche : Boutons ouverture mobile & collapse desktop + fil d'ariane */}
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
                            title="Réduire ou agrandir le menu latéral"
                            aria-label="Réduire le menu"
                        >
                            <Menu className="w-4 h-4" />
                        </button>

                        {/* Fil d'ariane dynamique */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Link href="/" className="hover:text-[#1D63ED] transition-colors">
                                Accueil
                            </Link>

                            {breadcrumbs && breadcrumbs.length > 0 ? (
                                breadcrumbs.map((crumb, idx) => (
                                    <React.Fragment key={idx}>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                                        {crumb.href ? (
                                            <Link href={crumb.href} className="hover:text-[#1D63ED] transition-colors">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {crumb.label}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {title || 'Tableau de bord'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Droite : Actions d'en-tête & Profil */}
                    <div className="flex items-center gap-3">
                        {headerActions ? (
                            headerActions
                        ) : (
                            <Link href="/rides/verify-before-publish">
                                <Button className="h-9 px-4 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold text-xs rounded-xl shadow-sm gap-2">
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">Proposer un trajet</span>
                                </Button>
                            </Link>
                        )}

                        <div className="relative hidden sm:block">
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
                            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#1D63ED] flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700 hover:border-[#1D63ED] transition-colors overflow-hidden">
                                {user?.photoIdentite ? (
                                    <img src={resolveAuthenticatedFileUrl(user.photoIdentite) || user.photoIdentite} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(displayName)
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Corps de la page */}
                <main className="flex-1 w-full">{children}</main>
            </div>
        </div>
    );
}
