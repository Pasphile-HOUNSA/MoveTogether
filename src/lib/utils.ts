import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { UrlMethodPair } from '@inertiajs/core';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(href: string | UrlMethodPair) {
    return typeof href === 'string' ? href : href.url;
}
