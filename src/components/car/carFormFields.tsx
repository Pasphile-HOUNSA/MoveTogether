import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { CAR_BRANDS } from '@/types/car';

type CarFormFieldsProps = {
    type: string;
    setType: (value: string) => void;
    mark: string;
    setMark: (value: string) => void;
    model: string;
    setModel: (value: string) => void;
    registrationNumber: string;
    setRegistrationNumber: (value: string) => void;
    nbrPlaces: number;
    setNbrPlaces: (value: number) => void;
    color: string;
    setColor: (value: string) => void;
    carteGriseNumero: string;
    setCarteGriseNumero: (value: string) => void;
    carteGriseScan: File | null;
    setCarteGriseScan: (file: File | null) => void;
    assuranceNumero: string;
    setAssuranceNumero: (value: string) => void;
    assuranceExpiration: string;
    setAssuranceExpiration: (value: string) => void;
    errors: Record<string, string>;
};

export default function CarFormFields({
    type,
    setType,
    mark,
    setMark,
    model,
    setModel,
    registrationNumber,
    setRegistrationNumber,
    nbrPlaces,
    setNbrPlaces,
    color,
    setColor,
    carteGriseNumero,
    setCarteGriseNumero,
    carteGriseScan,
    setCarteGriseScan,
    assuranceNumero,
    setAssuranceNumero,
    assuranceExpiration,
    setAssuranceExpiration,
    errors,
}: CarFormFieldsProps) {
    return (
        <div className="space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="type">Type de véhicule <span className="text-red-500">*</span></Label>
                <Select name="type" value={type} onValueChange={setType}>
                    <SelectTrigger id="type"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Voiture">Voiture</SelectItem>
                        <SelectItem value="Moto">Moto</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.type} />
            </div>

            {/* Marque & Modèle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="mark">
                        Marque <span className="text-red-500">*</span>
                    </Label>
                    <Select name="mark" value={mark} onValueChange={setMark}>
                        <SelectTrigger id="mark">
                            <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                            {CAR_BRANDS.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                    {brand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.mark} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="model">
                        Modèle <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="model"
                        type="text"
                        name="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Ex: Clio 4, 208, Model 3"
                        required
                    />
                    <InputError message={errors.model} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="carte_grise_numero">Numéro carte grise</Label>
                    <Input id="carte_grise_numero" value={carteGriseNumero} onChange={(e) => setCarteGriseNumero(e.target.value)} />
                    <InputError message={errors.carte_grise_numero} />
                </div>
                {type !== 'Moto' && (
                    <div className="grid gap-2">
                        <Label htmlFor="assurance_numero">Numéro assurance</Label>
                        <Input id="assurance_numero" value={assuranceNumero} onChange={(e) => setAssuranceNumero(e.target.value)} />
                        <InputError message={errors.assurance_numero} />
                    </div>
                )}
            </div>

            {type !== 'Moto' && (
                <div className="grid gap-2">
                    <Label htmlFor="assurance_expiration">Expiration assurance</Label>
                    <Input id="assurance_expiration" type="date" value={assuranceExpiration} onChange={(e) => setAssuranceExpiration(e.target.value)} />
                    <InputError message={errors.assurance_expiration} />
                </div>
            )}

            <div className="grid gap-2">
                <Label htmlFor="carte_grise_scan">Scan de la carte grise</Label>
                <Input
                    id="carte_grise_scan"
                    name="carte_grise_scan"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => setCarteGriseScan(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-slate-500">JPG, PNG ou PDF, 10 Mo maximum.</p>
                {carteGriseScan && <p className="text-xs text-slate-600">{carteGriseScan.name}</p>}
                <InputError message={errors.carte_grise_scan} />
            </div>

            {/* Plaque d'immatriculation */}
            <div className="grid gap-2">
                <Label htmlFor="registration_number">
                    Plaque d'immatriculation <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="registration_number"
                    type="text"
                    name="registration_number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="Ex: AB-123-CD"
                    className="uppercase"
                    required
                />
                <InputError message={errors.registration_number} />
            </div>

            {/* Places & Couleur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="nbr_places">
                        Nombre de places <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nbr_places"
                        type="number"
                        name="nbr_places"
                        min={1}
                        max={9}
                        value={nbrPlaces}
                        onChange={(e) => setNbrPlaces(parseInt(e.target.value) || 1)}
                        required
                    />
                    <InputError message={errors.nbr_places} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="color">
                        Couleur <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="color"
                        type="text"
                        name="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Ex: Noir, Blanc, Gris"
                        required
                    />
                    <InputError message={errors.color} />
                </div>
            </div>
        </div>
    );
}
