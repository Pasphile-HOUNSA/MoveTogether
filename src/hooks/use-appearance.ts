import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

function getResolvedAppearance(appearance: Appearance) {
    if (appearance !== 'system') {
        return appearance;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(() => {
        const storedAppearance = localStorage.getItem('appearance');
        return storedAppearance === 'light' ||
            storedAppearance === 'dark' ||
            storedAppearance === 'system'
            ? storedAppearance
            : 'system';
    });
    const [resolvedAppearance, setResolvedAppearance] = useState<'light' | 'dark'>(
        () => getResolvedAppearance(appearance),
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const applyAppearance = () => {
            const resolved = getResolvedAppearance(appearance);
            setResolvedAppearance(resolved);
            document.documentElement.classList.toggle('dark', resolved === 'dark');
        };

        applyAppearance();
        mediaQuery.addEventListener('change', applyAppearance);
        return () => mediaQuery.removeEventListener('change', applyAppearance);
    }, [appearance]);

    const updateAppearance = (nextAppearance: Appearance) => {
        localStorage.setItem('appearance', nextAppearance);
        setAppearance(nextAppearance);
    };

    return { appearance, resolvedAppearance, updateAppearance };
}
