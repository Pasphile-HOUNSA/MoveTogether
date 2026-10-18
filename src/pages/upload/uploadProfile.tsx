import React, { useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import StepIndicator from '@/components/documents/stepIndicator';
import FileDropZone from '@/components/documents/fileDropZone';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

interface AuthUser {
    idUser?: number | string;
    id?: number | string;
    firstName?: string;
    user_slug?: string;
    photoId?: string;
    numPiece?: string;
}

interface PageProps {
    auth?: {
        user?: AuthUser;
    };
    [key: string]: unknown;
}

interface FormState {
    photoId: File | null;
    numPiece: string;
    scanPiece: File | null;
}

export default function UploadForm() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;
    const userSlug = user?.firstName || user?.idUser || user?.user_slug || user?.id;

    const [step, setStep] = useState<number>(1);
    const photoFileRef = useRef<File | null>(null);
    const scanPieceFileRef = useRef<File | null>(null);

    const { data, setData, post, transform, processing, errors } = useForm<FormState>({
        photoId: null,
        numPiece: user?.numPiece || '',
        scanPiece: null,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(
        user?.photoId && userSlug ? `/users/${userSlug}/avatar` : null
    );
    const [scanPiecePreview, setScanPiecePreview] = useState<string | null>(null);

    const [customError, setCustomError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleFileChange =
        (
            fieldKey: 'photoId' | 'scanPiece',
            previewSetter: (url: string | null) => void,
            allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
        ) =>
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            setCustomError('');
            const file = e.target.files?.[0];
            if (!file) return;

            const extension = file.name.split('.').pop()?.toLowerCase();
            const isPdf = file.type === 'application/pdf' || extension === 'pdf';
            const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png'].includes(extension ?? '');

            if (!allowedTypes.includes(file.type) && !(isPdf && allowedTypes.includes('application/pdf')) && !isImage) {
                setCustomError('Format de fichier non supporté. Utilisez du JPG, PNG ou PDF.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setCustomError('Le fichier ne doit pas dépasser 5 Mo.');
                return;
            }

            const stableFile = new File([await file.arrayBuffer()], file.name, {
                type: isPdf ? 'application/pdf' : file.type,
                lastModified: file.lastModified,
            });

            if (fieldKey === 'photoId') {
                photoFileRef.current = stableFile;
            } else {
                scanPieceFileRef.current = stableFile;
            }

            setData((prev: any) => ({
                ...prev,
                [fieldKey]: stableFile,
            }));

            if (stableFile.type.startsWith('image/')) {
                previewSetter(URL.createObjectURL(stableFile));
            } else if (stableFile.type === 'application/pdf') {
                previewSetter('pdf');
            }
        };

    const handleNextStep = () => {
        setCustomError('');
        if (!data.photoId && !photoPreview) {
            setCustomError('Veuillez ajouter une photo de profil avant d’avancer.');
            return;
        }
        setStep(2);
    };

    const handleSubmitAll = (e: React.FormEvent) => {
        e.preventDefault();
        setCustomError('');
        setSuccess('');

        if (!user) {
            setCustomError('Impossible d’identifier votre compte.');
            return;
        }

        if (!data.photoId && !data.scanPiece && !photoPreview) {
            setCustomError('Veuillez fournir au moins un fichier.');
            return;
        }

        transform((currentData: any) => ({
            ...currentData,
            photoId: photoFileRef.current ?? currentData.photoId,
            scanPiece: scanPieceFileRef.current ?? currentData.scanPiece,
        }));

        post('/upload-profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccess('Documents enregistrés avec succès !');
            },
            onError: (errs: Record<string, string | string[]>) => {
                const first = Object.values(errs)[0];
                if (first) setCustomError(first as string);
            },
        });
    };

    const firstError = Object.values(errors as Record<string, string | string[]>)[0];
    const displayError = customError || (Array.isArray(firstError) ? String(firstError[0] ?? '') : String(firstError ?? ''));

    return (
        <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6">
            <Head title="Vérification du profil" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-linear-to-r from-[#1D63ED] to-[#4F8EFF] text-white rounded-3xl p-6 shadow-md shadow-blue-500/10 text-center relative overflow-hidden">
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
                    {!user ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-8 h-8 text-[#1D63ED] animate-spin" />
                            <p className="text-sm font-semibold text-slate-700">Chargement de votre profil...</p>
                        </div>
                    ) : (
                        <>
                            <StepIndicator step={step} />

                            {displayError && (
                                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-semibold">
                                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                    <span>{displayError}</span>
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
                                        <h2 className="text-lg font-bold text-slate-900">Photo de profil</h2>
                                        <p className="text-xs sm:text-sm font-medium text-slate-600">
                                            Votre visage doit être clairement visible.
                                        </p>
                                    </div>

                                    <FileDropZone
                                        onChange={handleFileChange('photoId', setPhotoPreview, ['image/jpeg', 'image/png'])}
                                        preview={photoPreview}
                                        fileName={data.photoId?.name}
                                        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                                        label="Glissez votre photo de profil ou cliquez"
                                        hint="Formats acceptés : JPG, PNG (max 5 Mo)"
                                        onRemove={
                                            photoPreview
                                                ? () => {
                                                      setPhotoPreview(null);
                                                      photoFileRef.current = null;
                                                      setData('photoId', null);
                                                  }
                                                : undefined
                                        }
                                    />

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="button"
                                            disabled={!data.photoId && !photoPreview}
                                            onClick={handleNextStep}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#1D63ED] hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
                                        >
                                            <span>Suivant</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Étape 2 : Pièce d'identité */}
                                <div className={step === 2 ? 'space-y-6' : 'hidden'}>
                                    <div className="space-y-1">
                                        <h2 className="text-lg font-bold text-slate-900">Pièce d'identité officielle</h2>
                                        <p className="text-xs sm:text-sm font-medium text-slate-600">
                                            Saisissez les références de votre pièce et téléversez son visuel.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            Numéro de la pièce
                                        </label>
                                        <input
                                            type="text"
                                            value={data.numPiece}
                                            onChange={(e) => setData('numPiece', e.target.value)}
                                            placeholder="ex: 123456789"
                                            required={step === 2}
                                            className="w-full bg-slate-50 border border-slate-300 focus:border-[#1D63ED] rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            Scan ou photo lisible de la pièce
                                        </label>
                                        <FileDropZone
                                            onChange={handleFileChange('scanPiece', setScanPiecePreview, ['image/jpeg', 'image/png', 'application/pdf'])}
                                            preview={scanPiecePreview}
                                            fileName={data.scanPiece?.name}
                                            accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf"
                                            label="Glissez le scan de la pièce ou cliquez"
                                            hint="Formats acceptés : JPG, PNG, PDF (max 5 Mo)"
                                            onRemove={
                                                scanPiecePreview
                                                    ? () => {
                                                          setScanPiecePreview(null);
                                                          scanPieceFileRef.current = null;
                                                          setData('scanPiece', null);
                                                      }
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Retour</span>
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Envoi en cours...</span>
                                                </>
                                            ) : (
                                                <span>Terminer et accéder au profil</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
