import type { LucideIcon } from 'lucide-react';
import type { UrlMethodPair } from '@inertiajs/core';

export type AppVariant = 'header' | 'sidebar';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href: string | UrlMethodPair;
    icon?: LucideIcon;
};

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    avatar_url?: string | null;
    profile_photo_url?: string | null;
};
