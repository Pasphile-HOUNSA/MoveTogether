import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    UploadCloud,
    Loader2,
    Calendar,
    ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    fetchMyDocuments,
    uploadDocumentFile,
    saveDriverDocuments,
    type DriverDocumentData,
} from '@/lib/document-service';
import { resolveAuthenticatedFileUrl } from '@/lib/secure-file';
import { isAuthenticated } from '@/lib/auth-service';

export default function DocumentCreate() {
    const navigate = useNavigate();

    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingPermis, setUploadingPermis] = useState(false);
    const [uploadingCertificat, setUploadingCertificat] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Données du formulaire
    const [numPermis, setNumPermis] = useState('');
    const [permisExpiration, setPermisExpiration] = useState('');
    const [scanPermisUrl, setScanPermisUrl] = useState<string | null>(null);
    const [certificatApt, setCertificatApt] = useState('');
    const [certificatAptScanUrl, setCertificatAptScanUrl] = useState<string | null>(null);

    // État serveur
    const [currentDoc, setCurrentDoc] = useState<DriverDocumentData | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        fetchMyDocuments()
            .then((res) => {
                if (res.success && res.driverDocument) {
                    const doc = res.driverDocument;
                    setCurrentDoc(doc);
                    setNumPermis(doc.numPermis || '');
                    setPermisExpiration(doc.permis_expiration || '');
                    setScanPermisUrl(doc.scanPermis || null);
                    setCertificatApt(doc.certificatApt || '');
                    setCertificatAptScanUrl(doc.certificatApt_scan || null);
                }
            })
            .catch(() => {
                setErrorMessage('Erreur lors de la récupération de vos documents.');
            })
            .finally(() => {
                setLoadingData(false);
            });
    }, [navigate]);

    // Téléversement du scan de permis vers Supabase Storage
    const handlePermisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setErrorMessage('');
        setUploadingPermis(true);

        const res = await uploadDocumentFile(file, 'scanpermis');
        setUploadingPermis(false);

        if (res.success && res.fileUrl) {
          setScanPermisUrl(res.fileUrl);
          setSuccessMessage('Scan du permis de conduire téléversé sur Supabase Storage.');
        } else {
            setErrorMessage(res.error || 'Erreur lors du téléversement du permis.');
        }
    };

    // Téléversement du certificat médical
    const handleCertificatUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setErrorMessage('');
        setUploadingCertificat(true);

        const res = await uploadDocumentFile(file, 'certificatapt_scan');
        setUploadingCertificat(false);

        if (res.success && res.fileUrl) {
            setCertificatAptScanUrl(res.fileUrl);
            setSuccessMessage('Scan du certificat médical téléversé avec succès.');
        } else {
            setErrorMessage(res.error || 'Erreur lors du téléversement du certificat.');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!numPermis.trim()) {
            setErrorMessage('Veuillez renseigner le numéro du permis.');
            return;
        }

        if (!permisExpiration) {
            setErrorMessage('Veuillez renseigner la date d\'expiration de votre permis.');
            return;
        }

        const expDate = new Date(permisExpiration);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expDate <= today) {
            setErrorMessage('Votre permis est expiré. Veuillez renseigner un permis valide.');
            return;
        }

        if (!scanPermisUrl) {
            setErrorMessage('Veuillez téléverser le scan ou la photo de votre permis.');
            return;
        }

        setSubmitting(true);

        const res = await saveDriverDocuments({
            numPermis: numPermis.trim(),
            permis_expiration: permisExpiration,
            scanPermis: scanPermisUrl,
            certificatApt: certificatApt.trim(),
            certificatApt_scan: certificatAptScanUrl,
        });

        setSubmitting(false);

        if (res.success) {
            setSuccessMessage(res.message || 'Vos documents ont été enregistrés avec succès.');
            // Recharger les données fraîches
            const fresh = await fetchMyDocuments();
            if (fresh.driverDocument) setCurrentDoc(fresh.driverDocument);
        } else {
            setErrorMessage(res.error || 'Erreur lors de l\'enregistrement des documents.');
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1D63ED]" />
                    <p className="text-sm font-medium">Chargement de vos documents...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Mes documents conducteur - MoveTogether" />
            <div className="min-h-screen w-full bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    <div>
                        <Link href="/rides/verify-before-publish">
                            <Button type="button" variant="ghost" size="sm" className="mb-3 gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Retour à la vérification
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-[#1D63ED] rounded-2xl">
                                <FileText className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                    Documents du conducteur
                                </h1>
                                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                                    Vérification officielle requise pour publier des trajets sur MoveTogether.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statuts du Workflow (4.3) */}
                    {currentDoc?.statut === 'valide' && (
                        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <AlertTitle className="font-bold">Documents validés</AlertTitle>
                            <AlertDescription>
                                Vos documents ont été vérifiés et validés par notre équipe. Vous pouvez publier des trajets en toute sécurité.
                            </AlertDescription>
                        </Alert>
                    )}

                    {currentDoc?.statut === 'en_attente' && (
                        <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                            <Clock className="h-5 w-5 text-amber-600" />
                            <AlertTitle className="font-bold">En cours de vérification</AlertTitle>
                            <AlertDescription>
                                Vos documents sont actuellement en cours d'examen par notre équipe de modération. Vous recevrez une notification dès validation.
                            </AlertDescription>
                        </Alert>
                    )}

                    {currentDoc?.statut === 'refuse' && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <AlertTitle className="font-bold">Dossier refusé</AlertTitle>
                            <AlertDescription className="space-y-1">
                                <p>Vos documents ont été rejetés pour le motif suivant :</p>
                                <p className="font-semibold text-red-950 dark:text-red-100 bg-red-100/60 dark:bg-red-900/30 p-2 rounded-lg">
                                    « {currentDoc.motif_refus || 'Document non conforme ou illisible'} »
                                </p>
                                <p className="text-xs">Veuillez corriger les informations ou téléverser de nouveaux scans lisibles ci-dessous.</p>
                            </AlertDescription>
                        </Alert>
                    )}

                    {currentDoc?.isExpired && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                            <AlertTitle className="font-bold">Permis de conduire expiré</AlertTitle>
                            <AlertDescription>
                                Votre permis a expiré. Vous devez fournir votre nouveau permis pour continuer à publier des trajets.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Rappel d'expiration proche */}
                    {currentDoc?.daysUntilExpiration !== null && currentDoc?.daysUntilExpiration !== undefined && currentDoc.daysUntilExpiration > 0 && currentDoc.daysUntilExpiration <= 30 && (
                        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                            <Calendar className="h-5 w-5 text-[#1D63ED]" />
                            <AlertTitle className="font-bold">Expiration prochaine</AlertTitle>
                            <AlertDescription>
                                Votre permis expire dans {currentDoc.daysUntilExpiration} jour(s). Pensez à le renouveler pour maintenir votre statut actif.
                            </AlertDescription>
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                        {/* Section 1 : Permis de conduire */}
                        <section className="space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>1. Permis de conduire</span>
                                    <span className="text-xs text-red-500 font-normal">*obligatoire</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="numPermis" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Numéro du permis
                                    </Label>
                                    <Input
                                        id="numPermis"
                                        placeholder="Ex: BEN-12345678"
                                        value={numPermis}
                                        onChange={(e) => setNumPermis(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="permisExpiration" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Date d'expiration
                                    </Label>
                                    <Input
                                        id="permisExpiration"
                                        type="date"
                                        value={permisExpiration}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setPermisExpiration(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Scan ou photo lisible du permis (Supabase Storage)
                                </Label>
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40">
                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {scanPermisUrl ? 'Fichier téléversé avec succès ✓' : 'Sélectionnez le fichier du permis'}
                                        </p>
                                        <p className="text-xs text-slate-500">Formats acceptés : PDF, JPG, PNG (max 5 Mo)</p>
                                        {scanPermisUrl && (
                                            <a
                                                href={resolveAuthenticatedFileUrl(scanPermisUrl) || scanPermisUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block text-xs text-[#1D63ED] underline font-medium mt-1"
                                            >
                                                Voir le document actuel
                                            </a>
                                        )}
                                    </div>
                                    <div className="shrink-0">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs transition-all">
                                            {uploadingPermis ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-[#1D63ED]" />
                                            ) : (
                                                <UploadCloud className="w-4 h-4 text-[#1D63ED]" />
                                            )}
                                            <span>{scanPermisUrl ? 'Remplacer' : 'Téléverser'}</span>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={handlePermisUpload}
                                                disabled={uploadingPermis}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 : Certificat d'aptitude médicale */}
                        <section className="space-y-5 border-t border-slate-100 pt-6 dark:border-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    2. Certificat d'aptitude médicale
                                </h2>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="certificatApt" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Référence / Émetteur du certificat
                                </Label>
                                <Input
                                    id="certificatApt"
                                    placeholder="Ex: CNHU Cotonou - Dr. Mensah"
                                    value={certificatApt}
                                    onChange={(e) => setCertificatApt(e.target.value)}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Scan ou photo du certificat d'aptitude
                                </Label>
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40">
                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {certificatAptScanUrl ? 'Certificat téléversé ✓' : 'Sélectionnez le fichier du certificat'}
                                        </p>
                                        <p className="text-xs text-slate-500">Formats acceptés : PDF, JPG, PNG (max 5 Mo)</p>
                                        {certificatAptScanUrl && (
                                            <a
                                                href={resolveAuthenticatedFileUrl(certificatAptScanUrl) || certificatAptScanUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block text-xs text-[#1D63ED] underline font-medium mt-1"
                                            >
                                                Voir le document actuel
                                            </a>
                                        )}
                                    </div>
                                    <div className="shrink-0">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs transition-all">
                                            {uploadingCertificat ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-[#1D63ED]" />
                                            ) : (
                                                <UploadCloud className="w-4 h-4 text-[#1D63ED]" />
                                            )}
                                            <span>{certificatAptScanUrl ? 'Remplacer' : 'Téléverser'}</span>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={handleCertificatUpload}
                                                disabled={uploadingCertificat}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                type="submit"
                                disabled={submitting || uploadingPermis || uploadingCertificat}
                                className="w-full h-12 bg-[#1D63ED] hover:bg-[#1552C6] text-white font-bold text-base rounded-xl transition-all shadow-md"
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Enregistrement en cours...</span>
                                    </div>
                                ) : (
                                    'Enregistrer mes documents'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

DocumentCreate.layout = (page: React.ReactNode) => page;
