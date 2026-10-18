import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

type ExistingDocument = {
    numPermis?: string | null;
    permis_expiration?: string | null;
    scanPermis?: string | null;
    certificatApt?: string | null;
    certificatApt_scan?: string | null;
};

type DocumentFormData = {
    numPermis: string;
    permis_expiration: string;
    scanPermis: File | null;
    certificatApt: string;
    certificatApt_scan: File | null;
};

type Props = {
    document?: ExistingDocument | null;
};

export default function DocumentCreate({ document = null }: Props) {
    const { data, setData, processing, errors, post } = useForm<DocumentFormData>({
        numPermis: document?.numPermis || '',
        permis_expiration: document?.permis_expiration || '',
        scanPermis: null,
        certificatApt: document?.certificatApt || '',
        certificatApt_scan: null,
    });

    useEffect(() => {
        if (document) {
            setData((current: any) => ({
                ...current,
                numPermis: document.numPermis || '',
                permis_expiration: document.permis_expiration || '',
                certificatApt: document.certificatApt || '',
            }));
        }
    }, [document]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/documents', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Mes documents" />
            <div className="min-h-screen w-full bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                    <div>
                        <Link href="/rides/verify-before-publish">
                            <Button type="button" variant="ghost" size="sm" className="mb-3 gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Retour à la vérification
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-[#1D63ED]" />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mes documents</h1>
                                <p className="mt-1 text-slate-600 dark:text-slate-400">
                                    Ajoutez les informations nécessaires pour publier un trajet.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                        <section className="space-y-5">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Permis de conduire</h2>
                            <div className="grid gap-2">
                                <Label htmlFor="numPermis">Numéro du permis</Label>
                                <Input id="numPermis" value={data.numPermis} onChange={(event) => setData('numPermis', event.target.value)} />
                                <InputError message={errors.numPermis} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="permis_expiration">Date d'expiration du permis</Label>
                                <Input id="permis_expiration" type="date" value={data.permis_expiration} onChange={(event) => setData('permis_expiration', event.target.value)} />
                                <InputError message={errors.permis_expiration} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="scanPermis">Scan du permis</Label>
                                <Input id="scanPermis" type="file" accept="image/*,application/pdf" onChange={(event) => setData('scanPermis', event.target.files?.[0] || null)} />
                                <p className="text-xs text-slate-500">PDF, JPG, PNG ou WEBP, 5 Mo maximum.</p>
                                <InputError message={errors.scanPermis} />
                            </div>
                        </section>

                        <section className="space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Certificat d'aptitude</h2>
                            <div className="grid gap-2">
                                <Label htmlFor="certificatApt">Référence du certificat</Label>
                                <Input id="certificatApt" value={data.certificatApt} onChange={(event) => setData('certificatApt', event.target.value)} />
                                <InputError message={errors.certificatApt} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="certificatApt_scan">Scan du certificat</Label>
                                <Input id="certificatApt_scan" type="file" accept="image/*,application/pdf" onChange={(event) => setData('certificatApt_scan', event.target.files?.[0] || null)} />
                                <p className="text-xs text-slate-500">PDF, JPG, PNG ou WEBP, 5 Mo maximum.</p>
                                <InputError message={errors.certificatApt_scan} />
                            </div>
                        </section>

                        <Button type="submit" disabled={processing} className="w-full bg-[#1D63ED] font-semibold text-white hover:bg-blue-700">
                            {processing ? 'Enregistrement...' : 'Enregistrer mes documents'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

DocumentCreate.layout = {
    breadcrumbs: [
        { title: 'Accueil', href: '/home' },
        { title: 'Mes documents', href: '/settings/documents' },
    ],
};
