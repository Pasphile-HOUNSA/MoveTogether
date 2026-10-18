import { Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CarFormActionsProps = {
    processing: boolean;
    onCancel?: () => void;
};

export default function CarFormActions({ processing, onCancel }: CarFormActionsProps) {
    return (
        <div className="flex gap-3 pt-4 justify-end">
            {onCancel && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={processing}
                >
                    Annuler
                </Button>
            )}

            <Button
                type="submit"
                disabled={processing}
                className="bg-[#1D63ED] hover:bg-[#1552C6] text-white px-6"
            >
                {processing ? (
                    <RefreshCw className="animate-spin mr-2" size={16} />
                ) : (
                    <Check className="mr-2" size={16} />
                )}
                {processing ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
        </div>
    );
}
