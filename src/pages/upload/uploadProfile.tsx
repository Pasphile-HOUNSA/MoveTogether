import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '@/components/documents/stepIndicator';
import FileDropZone from '@/components/documents/fileDropZone';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    fetchMyDocuments,
    uploadDocumentFile,
    saveIdentityDocuments,
} from '@/lib/document-service';
import { isAuthenticated } from '@/lib/auth-service';

export default function UploadProfile() {
    const navigate = useNavigate();

    const [step, setStep] = useState<number>(1);
    const [loadingData, setLoadingData] = useState(true);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingPiece, setUploadingPiece] = useState(false);
    const [saving, setSaving] = useState(false);

    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [numPiece, setNumPiece] = useState<string>('');
    const [scanPieceUrl, setScanPieceUrl] = useState<string | null>(null);

    const [statutPiece, setStatutPiece] = useState<string>('en_attente');
    const [motifRefusPiece, setMotifRefusPiece] = useState<string | null>(null);

    const [customError, setCustomError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        fetchMyDocuments()
            .then((res) => {
                if (res.success && res.identityDocument) {
                    const ident = res.identityDocument;
                    if (ident.photoId) setPhotoUrl(ident.photoId);
                    if (ident.numPiece) setNumPiece(ident.numPiece);
                    if (ident.scanPiece) setScanPieceUrl(ident.scanPiece);
                    if (ident.statut_piece) setStatutPiece(ident.statut_piece);
                    if (ident.motif_refus_piece) setMotifRefusPiece(ident.motif_refus_piece);
                }
            })
            .catch(() => {
                setCustomError('Erreur lors du chargement de vos informations.');
            })
            .finally(() => {
                setLoadingData(false);
            });
    }, [navigate]);

    // Téléversement de la photo de profil vers le bucket 'avatars'
    const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomError('');
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setCustomError('La photo ne doit pas dépasser 5 Mo.');
            return;
        }

        setUploadingPhoto(true);
        const res = await uploadDocumentFile(file, 'photoid');
        setUploadingPhoto(false);

        if (res.success && res.fileUrl) {
            setPhotoUrl(res.fileUrl);
            setSuccess('Photo de profil téléversée sur Supabase Storage ✓');
        } else {
            setCustomError(res.error || 'Erreur lors du téléversement de la photo.');
        }
    };

    // Téléversement du scan de la pièce d'identité vers le bucket 'documents'
    const handleScanPieceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomError('');
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setCustomError('Le fichier de la pièce ne doit pas dépasser 5 Mo.');
            return;
        }

        setUploadingPiece(true);
        const res = await uploadDocumentFile(file, 'scanpiece');
        setUploadingPiece(false);

        if (res.success && res.fileUrl) {
            setScanPieceUrl(res.fileUrl);
            setSuccess('Scan de la pièce d\'identité téléversé avec succès ✓');
        } else {
            setCustomError(res.error || 'Erreur lors du téléversement de la pièce.');
        }
    };

    const handleNextStep = () => {
        setCustomError('');
        if (!photoUrl) {
            setCustomError('Veuillez ajouter une photo de profil avant d’avancer.');
            return;
        }
        setStep(2);
    };

    const handleSubmitAll = async (e: React.FormEvent) => {
        e.preventDefault();
        setCustomError('');
        setSuccess('');

        if (!numPiece.trim()) {
            setCustomError('Veuillez saisir votre numéro de pièce d\'identité.');
            return;
        }

        if (!scanPieceUrl) {
            setCustomError('Veuillez téléverser le scan ou la photo de votre pièce d\'identité.');
            return;
        }

        setSaving(true);

        const res = await saveIdentityDocuments({
            numPiece: numPiece.trim(),
            scanPiece: scanPieceUrl,
            photoIdentite: photoUrl,
            photoId: photoUrl,
        });

        setSaving(false);

        if (res.success) {
            setSuccess(res.message || 'Pièce d\'identité enregistrée avec succès !');
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1500);
        } else {
            setCustomError(res.error || 'Erreur lors de l\'enregistrement des documents.');
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1D63ED]" />
                    <p className="text-sm font-semibold">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6">
            <Head title="Vérification du profil - MoveTogether" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-[#1D63ED] to-[#4F8EFF] text-white rounded-3xl p-6 shadow-md shadow-blue-500/10 text-center relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                        <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                            Vérification du profil
                        </h1>
                        <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto font-medium">
                            Aidez-nous à sécuriser la communauté en fournissant vos documents officiels.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                    <StepIndicator step={step} />

                    {/* Alerte si pièce rejetée */}
                    {statutPiece === 'refuse' && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm space-y-1">
                            <div className="flex items-center gap-2 font-bold text-red-900">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <span>Pièce d'identité rejetée</span>
                            </div>
                            <p className="text-xs">Motif : {motifRefusPiece || 'Non conforme'}. Veuillez renvoyer une photo nette.</p>
                        </div>
                    )}

                    {customError && (
                        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-semibold">
                            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                            <span>{customError}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-semibold">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmitAll}>
                        {/* Étape 1 : Photo de profil */}
                        <div className={step === 1 ? 'space-y-6' : 'hidden'}>
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900">1. Photo de profil</h2>
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                    Votre visage doit être clairement identifiable et centré.
                                </p>
                            </div>

                            <FileDropZone
                                onChange={handlePhotoFileChange}
                                preview={photoUrl}
                                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                                label={uploadingPhoto ? "Téléversement vers Supabase..." : "Glissez votre photo ou cliquez"}
                                hint="Formats acceptés : JPG, PNG (max 5 Mo)"
                                onRemove={photoUrl ? () => setPhotoUrl(null) : undefined}
                            />

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    disabled={!photoUrl || uploadingPhoto}
                                    onClick={handleNextStep}
                                    className="flex items-center gap-2 px-6 h-11 rounded-2xl bg-[#1D63ED] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                                >
                                    <span>Suivant</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Étape 2 : Pièce d'identité */}
                        <div className={step === 2 ? 'space-y-6' : 'hidden'}>
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900">2. Pièce d'identité officielle</h2>
                                <p className="text-xs sm:text-sm font-medium text-slate-600">
                                    CIP, Carte Nationale d'Identité ou Passeport biométrique.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Numéro de la pièce (CIP / CNI)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={numPiece}
                                        onChange={(e) => setNumPiece(e.target.value)}
                                        placeholder="ex: 0192837465"
                                        required={step === 2}
                                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#1D63ED] rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none pr-10"
                                    />
                                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <p className="text-[11px] text-slate-400">Ce numéro est chiffré en AES-256 dans notre base de données.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Scan ou photo lisible de la pièce
                                </label>
                                <FileDropZone
                                    onChange={handleScanPieceChange}
                                    preview={scanPieceUrl}
                                    accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
                                    label={uploadingPiece ? "Téléversement vers Supabase..." : "Glissez le scan de la pièce ou cliquez"}
                                    hint="Formats acceptés : JPG, PNG, PDF (max 5 Mo)"
                                    onRemove={scanPieceUrl ? () => setScanPieceUrl(null) : undefined}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="h-11 px-5 rounded-2xl border-slate-300 text-slate-800 font-bold text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                                    <span>Retour</span>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={saving || uploadingPiece || !scanPieceUrl}
                                    className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                                >
                                    {saving ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Enregistrement sécurisé...</span>
                                        </div>
                                    ) : (
                                        'Enregistrer mes documents'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

UploadProfile.layout = (page: React.ReactNode) => page;
