import { useCallback, useState } from 'react';

export const OTP_MAX_LENGTH = 6;

type TwoFactorState = {
    svg?: string;
    secretKey?: string;
    recoveryCodes?: string[];
};

async function requestTwoFactor<T>(path: string, method: 'GET' | 'POST' = 'GET') {
    const response = await fetch(path, {
        method,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(method === 'POST' ? { 'X-CSRF-TOKEN': getCsrfToken() } : {}),
        },
    });

    if (!response.ok) {
        throw new Error(`Two-factor authentication request failed (${response.status}).`);
    }

    return (await response.json()) as T;
}

function getCsrfToken() {
    const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    if (!token) {
        throw new Error('The CSRF token meta tag is missing.');
    }
    return token;
}

export function useTwoFactorAuth() {
    const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
    const [manualSetupKey, setManualSetupKey] = useState<string | null>(null);
    const [recoveryCodesList, setRecoveryCodesList] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const clearSetupData = useCallback(() => {
        setQrCodeSvg(null);
        setManualSetupKey(null);
    }, []);

    const clearTwoFactorAuthData = useCallback(() => {
        clearSetupData();
        setRecoveryCodesList([]);
        setErrors([]);
    }, [clearSetupData]);

    const fetchSetupData = useCallback(async () => {
        try {
            const [qr, key] = await Promise.all([
                requestTwoFactor<{ svg?: string }>('/user/two-factor-qr-code'),
                requestTwoFactor<{ secretKey?: string }>('/user/two-factor-secret-key'),
            ]);
            setQrCodeSvg(qr.svg ?? null);
            setManualSetupKey(key.secretKey ?? null);
            setErrors([]);
        } catch (error) {
            setErrors([error instanceof Error ? error.message : 'Unable to load two-factor setup data.']);
        }
    }, []);

    const fetchRecoveryCodes = useCallback(async () => {
        try {
            const { recoveryCodes } = await requestTwoFactor<TwoFactorState>(
                '/user/two-factor-recovery-codes',
            );
            setRecoveryCodesList(recoveryCodes ?? []);
            setErrors([]);
        } catch (error) {
            setErrors([error instanceof Error ? error.message : 'Unable to load recovery codes.']);
        }
    }, []);

    return {
        qrCodeSvg,
        hasSetupData: Boolean(qrCodeSvg && manualSetupKey),
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    };
}
