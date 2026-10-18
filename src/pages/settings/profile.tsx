import { useState, useRef } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User, Camera, Edit3, X, FileText } from 'lucide-react';

type UserData = {
    idUser: number;
    firstName: string;
    lastName: string;
    email: string;
    sex: string;
    birthday: string;
    phoneNumber: string;
    address: string;
    photoId?: string | null;
    numPiece?: string | null;
    scanPiece?: string | null;
    avatar_url?: string | null;
    registrationDate?: string;
    lastLogin?: string;
    isActive?: boolean;
    email_verified_at?: string | null;
};

type PageProps = {
    auth: {
        user: UserData;
    };
    userProfile?: UserData;
};

export default function Profile() {
    const { auth, userProfile } = usePage<PageProps>().props;

    // On utilise userProfile s'il est transmis par le contrôleur, sinon l'utilisateur connecté
    const user = userProfile || auth.user;
    const isOwnProfile = auth.user.idUser === user.idUser;

    const initialLastName = user.lastName || '';
    const initialFirstName = user.firstName || '';
    const initialPhone = user.phoneNumber || '';
    const initialBirthday = user.birthday ? user.birthday.split('T')[0] : '';
    const initialSex = user.sex || 'Homme';
    const initialNumPiece = user.numPiece || '';

    const existingAvatarUrl = user.avatar_url || null;
    const existingScanUrl = user.scanPiece ? `/users/${user.idUser}/scan` : null;

    const [isEditing, setIsEditing] = useState(false);
    const photoFileRef = useRef<File | null>(null);
    const scanPieceFileRef = useRef<File | null>(null);
    const [avatarState, setAvatarState] = useState({
        source: existingAvatarUrl,
        preview: existingAvatarUrl,
    });
    const avatarPreview =
        avatarState.source === existingAvatarUrl
            ? avatarState.preview
            : existingAvatarUrl;
    // Link to open when clicking the avatar: prefer local preview (data:) else server URL
    const avatarLink = avatarPreview ? (avatarPreview.startsWith('data:') ? avatarPreview : existingAvatarUrl) : null;

    const { data, setData, post, transform, processing, errors, reset, clearErrors } = useForm({
        _method: 'PATCH',
        lastName: initialLastName,
        firstName: initialFirstName,
        email: user.email || '',
        phoneNumber: initialPhone,
        sex: initialSex,
        birthday: initialBirthday,
        address: user.address || '',
        numPiece: initialNumPiece,
        photoId: null as File | null,
        scanPiece: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((currentData: any) => ({
            ...currentData,
            photoId: photoFileRef.current ?? currentData.photoId,
            scanPiece: scanPieceFileRef.current ?? currentData.scanPiece,
        }));
        post('/settings/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                clearErrors();
                setIsEditing(false);
                const updatedAvatarUrl = `/users/${user.idUser}/avatar?updated=${Date.now()}`;
                setAvatarState({
                    source: existingAvatarUrl,
                    preview: updatedAvatarUrl,
                });
            },
        });
    };

    const handleCancel = () => {
        reset();
        setAvatarState({
            source: existingAvatarUrl,
            preview: existingAvatarUrl,
        });
        setIsEditing(false);
    };

    return (
        <>
            <Head title={`Profil MoveTogether - ${user.firstName} ${user.lastName}`} />

            <h1 className="sr-only">Paramètres du profil</h1>

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col items-center justify-between sm:flex sm:gap-4">
                    <Heading
                        variant="small"
                        title={`Profil de ${user.firstName} ${user.lastName}`}
                        description="Consultez et modifiez les informations personnelles"
                    />

                    {isOwnProfile && (
                        !isEditing ? (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="bg-[#1D63ED] hover:bg-[#1552C6] text-white flex mt-4 items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                Modifier mes infos
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="flex mt-4 items-center gap-2 border-slate-300 text-slate-700"
                            >
                                <X className="w-4 h-4" />
                                Annuler
                            </Button>
                        )
                    )}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6  p-6  border-t-2 "
                >
                    {/* Photo de profil */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-[#1D63ED] flex items-center justify-center text-slate-400">
                                {avatarPreview ? (
                                    avatarLink ? (
                                        <a href={avatarLink} target="_blank" rel="noreferrer" className="block w-full h-full">
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar de profil"
                                                className="w-full h-full object-cover"
                                            />
                                        </a>
                                    ) : (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar de profil"
                                            className="w-full h-full object-cover"
                                        />
                                    )
                                ) : (
                                    <User className="w-12 h-12 text-slate-400" />
                                )}
                            </div>

                            {isEditing && (
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 bg-[#1D63ED] hover:bg-[#1552C6] text-white p-2 rounded-full cursor-pointer shadow-md transition-all group-hover:scale-105"
                                >
                                    <Camera className="w-4 h-4" />
                                    <input
                                        id="avatar-upload"
                                        name="photoId"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                clearErrors('photoId');
                                                const stableFile = new File([await file.arrayBuffer()], file.name, {
                                                    type: file.type,
                                                    lastModified: file.lastModified,
                                                });
                                                photoFileRef.current = stableFile;
                                                setData('photoId', stableFile);
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    if (typeof reader.result === 'string') {
                                                        setAvatarState({
                                                            source: existingAvatarUrl,
                                                            preview: reader.result,
                                                        });
                                                    }
                                                };
                                                reader.readAsDataURL(stableFile);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="space-y-1 text-center sm:text-left">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                {data.lastName} {data.firstName}
                            </h3>
                            <p className="text-xs text-slate-500">
                                Statut du compte : <span className={user.isActive ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                                    {user.isActive ? 'Actif' : 'Inactif'}
                                </span>
                            </p>
                            <InputError message={errors.photoId} className="mt-1" />
                        </div>
                    </div>

                    {/* Nom & Prénom */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={data.lastName}
                                onChange={(e) => setData('lastName', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Votre nom"
                            />
                            <InputError message={errors.lastName} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={data.firstName}
                                onChange={(e) => setData('firstName', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Votre prénom"
                            />
                            <InputError message={errors.firstName} />
                        </div>
                    </div>

                    {/* E-mail & Téléphone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Adresse E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={!isEditing}
                                autoComplete="username"
                                placeholder="exemple@domaine.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Téléphone</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                name="phoneNumber"
                                value={data.phoneNumber}
                                onChange={(e) => setData('phoneNumber', e.target.value)}
                                disabled={!isEditing}
                                placeholder="01XXXXXXXX"
                            />
                            <InputError message={errors.phoneNumber} />
                        </div>
                    </div>

                    {/* Sexe & Date de naissance */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="sex">Sexe</Label>
                            <Select
                                value={data.sex}
                                onValueChange={(value) => setData('sex', value)}
                                disabled={!isEditing}
                            >
                                <SelectTrigger id="sex">
                                    <SelectValue placeholder="Sélectionnez votre sexe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Homme">Homme</SelectItem>
                                    <SelectItem value="Femme">Femme</SelectItem>
                                    <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.sex} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="birthday">Date de naissance</Label>
                            <Input
                                id="birthday"
                                name="birthday"
                                type="date"
                                value={data.birthday}
                                onChange={(e) => setData('birthday', e.target.value)}
                                disabled={!isEditing}
                            />
                            <InputError message={errors.birthday} />
                        </div>
                    </div>

                    {/* Adresse */}
                    <div className="grid gap-2">
                        <Label htmlFor="address">Adresse de résidence</Label>
                        <Input
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Ville, Quartier, Bénin"
                        />
                        <InputError message={errors.address} />
                    </div>

                    {/* Pièce d'identité (Champs numPiece et scanPiece) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid gap-2">
                            <Label htmlFor="numPiece">Numéro de pièce d'identité</Label>
                            <Input
                                id="numPiece"
                                name="numPiece"
                                value={data.numPiece}
                                onChange={(e) => setData('numPiece', e.target.value)}
                                disabled={!isEditing}
                                placeholder="ex: NPI / Passeport / CNI"
                            />
                            <InputError message={errors.numPiece} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="scanPiece">Scan de la pièce d'identité</Label>
                            {isEditing ? (
                                <Input
                                    id="scanPiece"
                                    name="scanPiece"
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        clearErrors('scanPiece');
                                        const stableFile = new File([await file.arrayBuffer()], file.name, {
                                            type: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : ''),
                                            lastModified: file.lastModified,
                                        });
                                        scanPieceFileRef.current = stableFile;
                                        setData('scanPiece', stableFile);
                                    }}
                                />
                            ) : (
                                <div className="flex items-center gap-2 p-2 rounded-md border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
                                    <FileText className="w-4 h-4" />
                                    {user.scanPiece ? (
                                        <a href={existingScanUrl as string} target="_blank" rel="noreferrer" className="text-[#1D63ED] underline">
                                            Voir la pièce d'identité
                                        </a>
                                    ) : (
                                        <span>Aucun document téléversé</span>
                                    )}
                                </div>
                            )}
                            <InputError message={errors.scanPiece} />
                        </div>
                    </div>

                    {/* Bouton de sauvegarde */}
                    {isEditing && (
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-[#1D63ED] hover:bg-[#1552C6] text-white px-6"
                            >
                                {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}
