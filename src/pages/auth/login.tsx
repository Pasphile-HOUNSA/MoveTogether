import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Car } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-50 dark:bg-slate-950">
            <Head title="Connexion" />



            <div className="hidden lg:block lg:w-1/2 h-screen bg-[#1D63ED] min-h-full w-1/2 text-white p-6 text-center relative flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Car className="w-7 h-7 text-white" />
                </div>
                {/* <img
                    src={ registerIMG }
                    alt="Authentication visual"
                    className="w-full h-full object-cover transition-all duration-500"
                /> */}

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-end p-10 lg:p-12 text-white">

                    <h1 className="text-2xl font-bold">Connexion</h1>
                    <p className="text-white/80 text-xl mt-1">Accédez à votre compte <span className="text-[#1D63ED] font-bold"> MoveTogether </span> pour continuer</p>

                </div>

            </div>

            <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center sm:px-6 lg:px-8 overflow-y-auto">

                <div className=" mb-5 lg:hidden  text-center relative flex-col items-center justify-center">

                    <h1 className="text-2xl font-bold">Connexion</h1>
                    <p className=" text-sm mt-1">Accédez à votre compte <span className="text-[#1D63ED] font-bold"> MoveTogether </span> pour continuer</p>

                </div>

                {/* <PasskeyVerify /> */}

                <Form
                    action="/login"
                    method="post"
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Mot de passe</Label>

                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />

                                    {canResetPassword && (
                                        <TextLink
                                            href="/forgot-password"
                                            className="ml-auto text-[#1D63ED] hover:underline text-sm"
                                            tabIndex={5}
                                        >
                                            Mot de passe oublié?
                                        </TextLink>
                                    )}
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="data-[state=checked]:bg-[#1D63ED] data-[state=checked]:border-[#1D63ED] data-[state=checked]:text-white"
                                    />
                                    <Label htmlFor="remember">Se souvenir de moi</Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-6 h-11 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-medium text-base rounded-lg transition-colors shadow-sm"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Se Connecter
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Vous n'avez pas de compte?{' '}
                                <TextLink href="/register" tabIndex={5} className='text-[#1D63ED] font-semibold hover:underline'>
                                    Créer un compte
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>

            </div>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </div>
    );
}

Login.layout = {
    title: 'Connectez-vous à votre compte',
    description: 'Saisissez votre adresse e-mail et votre mot de passe ci-dessous pour vous connecter.',
};
