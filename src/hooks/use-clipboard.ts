import { useState } from 'react';

export function useClipboard(): [string | null, (value: string) => Promise<void>] {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copy = async (value: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedText(value);
    };

    return [copiedText, copy];
}
