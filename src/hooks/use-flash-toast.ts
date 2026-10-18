import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

type FlashProps = {
    flash?: {
        success?: string;
        error?: string;
    };
};

export function useFlashToast() {
    const { flash } = usePage<FlashProps>().props;
    const lastMessage = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (flash?.success && flash.success !== lastMessage.current) {
            toast.success(flash.success);
            lastMessage.current = flash.success;
        } else if (flash?.error && flash.error !== lastMessage.current) {
            toast.error(flash.error);
            lastMessage.current = flash.error;
        }
    }, [flash?.error, flash?.success]);
}
