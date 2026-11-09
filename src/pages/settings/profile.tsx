import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import {
    Car,
    User,
    Menu,
    X,
    ChevronRight,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Lock,
    Camera,
    Edit3,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileText,
    ExternalLink,
    BadgeCheck,
} from 'lucide-react';
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
import {
    getStoredUser,
    isAuthenticated,
    fetchCurrentUser,
    updateUserProfile,
    type AuthUser,
} from '@/lib/auth-service';
import {
    fetchMyDocuments,
    uploadDocumentFile,
    type DriverDocumentData,
    type IdentityDocumentData,
} from '@/lib/document-service';
import { resolveAuthenticatedFileUrl } from '@/lib/secure-file';
import Sidebar from '@/components/layout/Sidebar';

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export default function ProfilePage() {
    const navigate = useNavigate();

    // États de navigation sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // États utilisateur et données
    const [user, setUser] = useState<AuthUser | null>(null);
    const [driverDoc, setDriverDoc] = useState<DriverDocumentData | null>(null);
    const [identityDoc, setIdentityDoc] = useState<IdentityDocumentData | null>(null);
    const [loading, setLoading] = useState(true);

    // Mode édition & chargement
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingScan, setUploadingScan] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Formulaire
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        sex: 'Homme',
        birthday: '',
        address: '',
        numpiece: '',
    });

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [scanPieceUrl, setScanPieceUrl] = useState<string | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const scanInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        const localUser = getStoredUser();
        if (localUser) {
            populateForm(localUser);
        }

        Promise.all([
            fetchCurrentUser(),
            fetchMyDocuments(),
        ])
            .then(([userRes, docRes]) => {
                if (userRes.success && userRes.user) {
                    populateForm(userRes.user);
                }
                if (docRes.success) {
                    if (docRes.driverDocument) setDriverDoc(docRes.driverDocument);
                    if (docRes.identityDocument) setIdentityDoc(docRes.identityDocument);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    const populateForm = (u: AuthUser) => {
        setUser(u);
        setFormData({
            firstname: u.firstname || '',
            lastname: u.lastname || '',
            email: u.email || '',
            phonenumber: u.phonenumber || '',
            sex: (u.sex === 'F' || u.sex === 'Femme') ? 'Femme' : 'Homme',
            birthday: u.birthday ? u.birthday.split('T')[0] : '',
            address: u.address || '',
            numpiece: u.numpiece || '',
        });
        setAvatarUrl(u.photoIdentite || null);
        setScanPieceUrl(u.scanpiece || null);
    };

    // Téléversement direct de l'avatar
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setFeedback({ type: 'error', text: 'La photo ne doit pas dépasser 5 Mo.' });
            return;
        }

        setUploadingAvatar(true);
        setFeedback(null);

        try {
            const res = await uploadDocumentFile(file, 'photoid');
            if (res.success && res.fileUrl) {
                setAvatarUrl(res.fileUrl);
                await updateUserProfile({ photoIdentite: res.fileUrl });
                setFeedback({ type: 'success', text: 'Photo de profil mise à jour et synchronisée.' });
            } else {
                setFeedback({ type: 'error', text: res.error || 'Erreur lors du téléversement.' });
            }
        } catch {
            setFeedback({ type: 'error', text: 'Erreur réseau lors du téléversement.' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Téléversement du scan de la pièce d'identité
    const handleScanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setFeedback({ type: 'error', text: 'Le document ne doit pas dépasser 5 Mo.' });
            return;
        }

        setUploadingScan(true);
        setFeedback(null);

        try {
            const res = await uploadDocumentFile(file, 'scanpiece');
            if (res.success && res.fileUrl) {
                setScanPieceUrl(res.fileUrl);
                await updateUserProfile({ scanpiece: res.fileUrl });
                setFeedback({ type: 'success', text: 'Scan de la pièce d\'identité mis à jour.' });
            } else {
                setFeedback({ type: 'error', text: res.error || 'Erreur lors du téléversement.' });
            }
        } catch {
            setFeedback({ type: 'error', text: 'Erreur réseau lors du téléversement.' });
        } finally {
            setUploadingScan(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);
        setIsSaving(true);

        try {
            const res = await updateUserProfile({
                firstname: formData.firstname.trim(),
                lastname: formData.lastname.trim(),
                phonenumber: formData.phonenumber.trim(),
                sex: formData.sex as any,
                birthday: formData.birthday,
                address: formData.address.trim(),
                numpiece: formData.numpiece.trim(),
                photoIdentite: avatarUrl || undefined,
                scanpiece: scanPieceUrl || undefined,
            });

            if (res.success && res.user) {
                populateForm(res.user);
                setIsEditing(false);
                setFeedback({ type: 'success', text: 'Vos modifications ont été enregistrées avec succès.' });
            } else {
                setFeedback({ type: 'error', text: res.error || 'Erreur lors de l\'enregistrement.' });
            }
        } catch (err: any) {
            setFeedback({ type: 'error', text: err.message || 'Erreur de connexion au serveur.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) populateForm(user);
        setIsEditing(false);
        setFeedback(null);
    };

    const displayName =
        [user?.firstname, user?.lastname].filter(Boolean).join(' ') ||
        user?.email ||
        'Membre MoveTogether';

    const isDriver = user?.role === 'conducteur';
    const profileComplete = user?.profileComplete ?? false;

    // Résolution des URLs sécurisées (fichiers chiffrés côté backend)
    const resolvedAvatarUrl = resolveAuthenticatedFileUrl(avatarUrl);
    const resolvedScanPieceUrl = resolveAuthenticatedFileUrl(scanPieceUrl);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-[#1D63ED]" />
            </div>
        );
    }

    return (
        <>
            <Head title={`Profil - ${displayName}`} />

            <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans">
                {/* 1. SIDEBAR RÉUTILISABLE */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    customUser={user}
                />

                {/* 2. ZONE PRINCIPALE DE LA PAGE DE PROFIL */}
                <div
                    className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                    }`}
                >
                    {/* Header supérieur */}
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/90">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Réduire le menu"
                            >
                                <Menu className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                <Link href="/dashboard" className="hover:text-[#1D63ED]">Accueil</Link>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                                <span>Mon Compte</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                                <span className="font-bold text-slate-900 dark:text-white">Profil & Identité</span>
                            </div>
                        </div>

                        {/* Actions rapides header */}
                        <div className="flex items-center gap-3">
                            {!isEditing ? (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="h-9 px-4 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-semibold text-xs rounded-xl shadow-xs gap-2"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Modifier mon profil</span>
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="h-9 px-3 text-xs font-semibold rounded-xl border-slate-300"
                                    >
                                        <X className="w-3.5 h-3.5 mr-1" />
                                        Annuler
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs gap-1.5"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-3.5 h-3.5" />
                                                Enregistrer
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Contenu de la page */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
                        {/* Alertes de retour */}
                        {feedback && (
                            <div
                                className={`p-4 rounded-2xl flex items-center gap-3 text-sm transition-all shadow-xs ${
                                    feedback.type === 'success'
                                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300'
                                        : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300'
                                }`}
                            >
                                {feedback.type === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                )}
                                <span className="font-medium">{feedback.text}</span>
                            </div>
                        )}

                        {/* 1. HERO BANNER DE PROFIL */}
                        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                                {/* Photo de profil avec déclencheur direct */}
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md">
                                        {resolvedAvatarUrl ? (
                                            <img
                                                src={resolvedAvatarUrl}
                                                alt={displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl font-black text-[#1D63ED]">
                                                {getInitials(displayName)}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={uploadingAvatar}
                                        title="Changer ma photo de profil"
                                        className="absolute -bottom-2 -right-2 p-2 bg-[#1D63ED] hover:bg-[#1552C6] text-white rounded-xl shadow-md transition-transform hover:scale-110"
                                    >
                                        {uploadingAvatar ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Camera className="w-4 h-4" />
                                        )}
                                    </button>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>

                                {/* Données clés & badges */}
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                            {displayName}
                                        </h1>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                                            Compte Vérifié
                                        </span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                        {user?.email} • Bénin
                                    </p>

                                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                                        <span
                                            className={`px-3 py-1 rounded-full font-bold ${
                                                isDriver
                                                    ? 'bg-blue-50 text-[#1D63ED] dark:bg-blue-950/60 dark:text-blue-300'
                                                    : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                            }`}
                                        >
                                            Rôle : {isDriver ? 'Conducteur vérifié' : 'Passager certifié'}
                                        </span>

                                        <span className="px-3 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {profileComplete ? '✓ Profil 100% complet' : '⚠️ Profil incomplet'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Barre de complétude circulaire / jauge */}
                            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 flex flex-col items-center sm:items-end w-full md:w-auto">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Niveau du compte
                                </span>
                                <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    {profileComplete ? '100%' : '75%'}
                                </div>
                                <span className="text-xs text-emerald-600 font-semibold mt-0.5">
                                    {profileComplete ? 'Toutes données vérifiées' : 'Complétion requise'}
                                </span>
                            </div>
                        </div>

                        {/* 2. FORMULAIRE ET CARTES THÉMATIQUES */}
                        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Colonne Gauche : Données Personnelles & Coordonnées (8 cols) */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Carte A : État civil */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="p-2.5 rounded-xl bg-blue-50 text-[#1D63ED] dark:bg-blue-950/60">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                                Informations personnelles
                                            </h2>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Vos informations officielles utilisées pour l'identification.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="firstname" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Prénom
                                            </Label>
                                            <Input
                                                id="firstname"
                                                disabled={!isEditing}
                                                value={formData.firstname}
                                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                                placeholder="Votre prénom"
                                                className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="lastname" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Nom de famille
                                            </Label>
                                            <Input
                                                id="lastname"
                                                disabled={!isEditing}
                                                value={formData.lastname}
                                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                                placeholder="Votre nom"
                                                className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="sex" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Sexe
                                            </Label>
                                            <Select
                                                disabled={!isEditing}
                                                value={formData.sex}
                                                onValueChange={(val) => setFormData({ ...formData, sex: val })}
                                            >
                                                <SelectTrigger id="sex" className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                                                    <SelectValue placeholder="Sélectionnez" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Homme">Homme</SelectItem>
                                                    <SelectItem value="Femme">Femme</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="birthday" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                Date de naissance
                                            </Label>
                                            <Input
                                                id="birthday"
                                                type="date"
                                                disabled={!isEditing}
                                                value={formData.birthday}
                                                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                                className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Carte B : Coordonnées & Résidence */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                                Coordonnées & Résidence
                                            </h2>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Pour les alertes SMS et le contact direct des passagers.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                Adresse E-mail
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                disabled={true}
                                                value={formData.email}
                                                className="h-11 rounded-xl bg-slate-100/70 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                                            />
                                            <span className="text-[11px] text-emerald-600 font-medium">✓ E-mail vérifié</span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="phonenumber" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                Numéro de téléphone
                                            </Label>
                                            <Input
                                                id="phonenumber"
                                                type="tel"
                                                disabled={!isEditing}
                                                value={formData.phonenumber}
                                                onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                                                placeholder="+229 01XXXXXXXX"
                                                className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                                            />
                                        </div>

                                        <div className="sm:col-span-2 space-y-1.5">
                                            <Label htmlFor="address" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                Adresse de résidence
                                            </Label>
                                            <Input
                                                id="address"
                                                disabled={!isEditing}
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="Ex: Cotonou, Haie Vive, Bénin"
                                                className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Colonne Droite : Identité Chiffrée AES-256 & Documents (4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Carte Sécurité & Chiffrement CIP */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                Pièce d'identité
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                            <Lock className="w-3 h-3 text-emerald-600" />
                                            AES-256
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="numpiece" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                N° CIP / Passeport
                                            </Label>
                                            <Input
                                                id="numpiece"
                                                disabled={!isEditing}
                                                value={formData.numpiece}
                                                onChange={(e) => setFormData({ ...formData, numpiece: e.target.value })}
                                                placeholder="Ex: 0192837465"
                                                className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 font-mono text-xs"
                                            />
                                        </div>

                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-slate-600 dark:text-slate-300">Scan du document</span>
                                                <span className="text-[10px] font-bold text-emerald-600">
                                                    {identityDoc?.statut_piece === 'valide'
                                                        ? 'Validé'
                                                        : identityDoc?.statut_piece === 'refuse'
                                                        ? 'Refusé'
                                                        : scanPieceUrl
                                                        ? 'Enregistré'
                                                        : 'Manquant'}
                                                </span>
                                            </div>

                                            {scanPieceUrl ? (
                                                <a
                                                    href={resolvedScanPieceUrl || scanPieceUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs text-[#1D63ED] hover:underline font-semibold"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    Consulter mon scan
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <p className="text-[11px] text-slate-400">Aucun scan enregistré pour l'instant.</p>
                                            )}

                                            {isEditing && (
                                                <div className="pt-1">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => scanInputRef.current?.click()}
                                                        disabled={uploadingScan}
                                                        className="w-full text-xs font-semibold h-8 rounded-lg"
                                                    >
                                                        {uploadingScan ? (
                                                            <>
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                                                Téléversement...
                                                            </>
                                                        ) : (
                                                            'Remplacer le scan'
                                                        )}
                                                    </Button>
                                                    <input
                                                        ref={scanInputRef}
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        className="hidden"
                                                        onChange={handleScanUpload}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Carte Documents Conducteur (Permis & Aptitude) */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-blue-50 text-[#1D63ED] dark:bg-blue-950/60">
                                                <Car className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                Documents Conducteur
                                            </span>
                                        </div>
                                        <Link href="/documents/create" className="text-xs font-semibold text-[#1D63ED] hover:underline">
                                            Gérer
                                        </Link>
                                    </div>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                                            <span className="text-slate-600 dark:text-slate-300 font-medium">Permis de conduire</span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    driverDoc?.statut === 'valide'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : driverDoc?.statut === 'refuse'
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : driverDoc?.numPermis
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-slate-200 text-slate-600'
                                                }`}
                                            >
                                                {driverDoc?.statut === 'valide'
                                                    ? 'Validé'
                                                    : driverDoc?.statut === 'refuse'
                                                    ? 'Refusé'
                                                    : driverDoc?.numPermis
                                                    ? 'En attente'
                                                    : 'Non soumis'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                                            <span className="text-slate-600 dark:text-slate-300 font-medium">Certificat médical</span>
                                            <span className="text-[10px] font-bold text-slate-600">
                                                {driverDoc?.certificatApt ? 'Enregistré' : 'Non requis'}
                                            </span>
                                        </div>
                                    </div>

                                    <Link href="/documents/create" className="block pt-1">
                                        <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-xl h-9">
                                            Mettre à jour mes pièces conducteur
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>
    );
}
