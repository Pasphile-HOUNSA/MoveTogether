import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import type { FormEvent, ChangeEvent } from 'react';
import { EyeOff, Eye, AlertCircle, CheckCircle, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    sex: string;
    birthday: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    confirmPassword: string;
}

interface ValidationErrors {
    [key: string]: string;
}

export default function Register() {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        sex: 'Homme',
        birthday: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (validationErrors[id]) {
            setValidationErrors((prev) => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        }
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            sex: value,
        }));
        if (validationErrors.sex) {
            setValidationErrors((prev) => {
                const updated = { ...prev };
                delete updated.sex;
                return updated;
            });
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setValidationErrors({});
        setLoading(true);

        const newErrors: ValidationErrors = {};

        if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères.';
        }
        if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Le nom doit contenir au moins 2 caractères.';
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "L'adresse e-mail est invalide.";
        }

        const birthDate = new Date(formData.birthday);
        const ageLimit = new Date();
        ageLimit.setFullYear(ageLimit.getFullYear() - 18);
        if (birthDate > ageLimit) {
            newErrors.birthday = 'Vous devez avoir au moins 18 ans.';
        }

        // Validation - Téléphone (Bénin format: +22901XXXXXXXX ou 01XXXXXXXX)
        const phoneNumber = formData.phoneNumber.trim().replace(/\s|-/g, '');
        const phoneRegex = /^(\+22901|01)\d{8}$/;
        if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
            newErrors.phoneNumber = 'Le numéro doit être au format: 01XXXXXXXX (10 chiffres).';
        }

        if (formData.address.trim().length < 5) {
            newErrors.address = "L'adresse doit faire au moins 5 caractères.";
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Mot de passe invalide (8 caractères, majuscule, chiffre, symbole).';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            setError('Veuillez corriger les erreurs du formulaire.');
            setLoading(false);
            return;
        }

        router.post('/register', { ...formData }, {
            onSuccess: () => {
                setSuccess('Inscription réussie ! Redirection en cours...');
                setFormData({
                    firstName: '',
                    lastName: '',
                    sex: 'Homme',
                    birthday: '',
                    email: '',
                    phoneNumber: '',
                    address: '',
                    password: '',
                    confirmPassword: '',
                });
            },
            onError: (errors: Record<string, string | string[]>) => {
                const serverErrors: ValidationErrors = {};
                if (typeof errors === 'object' && errors !== null) {
                    Object.keys(errors).forEach((key) => {
                        serverErrors[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
                    });
                }
                setValidationErrors(serverErrors);
                setError("Erreur lors de l'inscription. Veuillez réessayer.");
            },
            onFinish: () => setLoading(false),
        });
    };

    return (

        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-50 dark:bg-slate-950">

            <Head title="Inscription" />

            {/* En-tête Bleu Référence à votre maquette */}
            <div className="hidden md:hidden lg:block lg:w-1/2 h-screen bg-[#1D63ED] min-h-full w-1/2 text-white p-6 text-center relative flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Car className="w-7 h-7 text-white" />
                </div>
                {/* <img
                    src={ registerIMG }
                    alt="Authentication visual"
                    className="w-full h-full object-cover transition-all duration-500"
                /> */}

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-end p-10 lg:p-12 text-white">

                    <h1 className="text-2xl font-bold">Créer un compte</h1>
                    <p className="text-white/80 text-xl mt-1">Rejoignez <span className="text-[#1D63ED] font-bold"> MoveTogether </span>, la communauté qui partage la route.</p>

                </div>

            </div>

            {/* Corps de la carte */}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center py-7 sm:px-6 lg:px-8 overflow-y-auto">
                {error && (
                    <Alert variant="destructive" className="mb-5 bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-5 border-[#28A745] bg-emerald-50 text-[#1e7e34] dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                        <CheckCircle className="h-4 w-4 text-[#28A745]" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-5 lg:hidden text-center relative flex-col items-center justify-center">

                    <h1 className="text-2xl font-bold">Créer un compte</h1>
                    <p className=" text-sm mt-1">Rejoignez <span className="text-[#1D63ED] font-bold"> MoveTogether </span>, la communauté qui partage la route.</p>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4 ">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Nom</Label>
                            <Input
                                type="text"
                                id="lastName"
                                placeholder="Dupont"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                            />
                            {validationErrors.lastName && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Prénom</Label>
                            <Input
                                type="text"
                                id="firstName"
                                placeholder="Jean"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                            />
                            {validationErrors.firstName && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                            )}
                        </div>
                    </div>

                    {/* Sexe & Date de naissance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="sex" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Sexe</Label>
                            <Select value={formData.sex} onValueChange={handleSelectChange}>
                                <SelectTrigger className="mt-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Homme">Homme</SelectItem>
                                    <SelectItem value="Femme">Femme</SelectItem>
                                    <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                            {validationErrors.sex && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.sex}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="birthday" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Date de naissance</Label>
                            <Input
                                type="date"
                                id="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                required
                                className="mt-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                            />
                            {validationErrors.birthday && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.birthday}</p>
                            )}
                        </div>
                    </div>

                    {/* E-mail & Téléphone */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">E-mail</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="jean@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                            />
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phoneNumber" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Téléphone</Label>
                            <div className="flex gap-2 mt-1">
                                <Select defaultValue="+229">
                                    <SelectTrigger className="w-22.5 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+229">+229</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="tel"
                                    id="phoneNumber"
                                    placeholder="01XXXXXXXX"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                            </div>
                            {validationErrors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.phoneNumber}</p>
                            )}
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Format: 01XXXXXXXX </p>
                        </div>
                    </div>

                    {/* Adresse */}
                    <div>
                        <Label htmlFor="address" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Adresse</Label>
                        <Input
                            type="text"
                            id="address"
                            placeholder="Cotonou, Bénin"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="mt-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                        />
                        {validationErrors.address && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                        )}
                    </div>

                    {/* Mot de passe & Confirmation */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Mot de passe</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="pr-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Confirmer mot de passe</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="pr-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-slate-100 focus:border-[#1D63ED] focus:bg-white dark:focus:bg-slate-800"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Bouton de Soumission Bleu vif (#1D63ED) */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 h-11 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-medium text-base rounded-lg transition-colors shadow-sm"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Inscription en cours...</span>
                            </div>
                        ) : (
                            "S'inscrire"
                        )}
                    </Button>

                    {/* Lien Connexion */}
                    <div className="flex items-center justify-center gap-1 mt-6 text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Vous avez déjà un compte ?</span>
                        <a href="/login" className="text-[#1D63ED] font-semibold hover:underline">
                            Se connecter
                        </a>
                    </div>
                </form>


            </div>
        </div>
    );
}


Register.layout = (page: React.ReactNode) => page;
