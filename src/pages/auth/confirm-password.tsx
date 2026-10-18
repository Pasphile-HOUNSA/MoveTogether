import { Form, Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-slate-950">
            <Head title="Confirm password" />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Confirmer avec une Clé d'accès"
                loadingLabel="Confirmation..."
                separator="Ou confirmer avec le Mot de passe"
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Mot de passe"
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="mt-6 h-11 w-full rounded-lg bg-[#1D63ED] text-base font-medium text-white shadow-sm transition-colors hover:bg-[#1552C6]"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Confirmer le Mot de passe
                            </Button>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-muted-foreground"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft />
                                Retour
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm password',
    description:
        "Il s'agit d'une zone sécurisée de l'application. Veuillez confirmer votre mot de passe avant de continuer.",
};
